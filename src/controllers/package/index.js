import { postConfig } from "/api/config/config.js";
import { pickAndPerformPupAction } from "/api/action/action.js";

class PkgController {
  observers = [];
  actions = [];

  pups = []
  stateIndex = {}
  statsIndex = {}
  sourcesIndex = {}
  assetIndex = {}

  constructor() {
    this.transactionTimeoutChecker();
  }

  // Register an observer
  addObserver(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  // Remove an observer
  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  // Notify all registered observers of a state change
  notify(pupId) {
    for (const observer of this.observers) {
      if (!pupId) {
        observer.requestUpdate();
      }
      if (pupId === observer.pupId) {
        observer.requestUpdate();
      }
    }
  }

  setData(bootstrapResponseV2) {
    const { states, stats, assets } = bootstrapResponseV2;
    this.handleBootstrapResponse(states, stats, assets);
    this.notify();
  }

  setStoreData(storeListingRes) {
    this.handleSourcesResponse(storeListingRes);
    this.notify();
  }

  handleBootstrapResponse(states, stats, assets) {
    this.stateIndex = states || {};
    this.statsIndex = stats || {};
    this.assetIndex = assets || {};
    this.pups = [];

    for (const [stateKey, stateData] of Object.entries(states)) {

      // Do we have this pup in memory?
      const { pup, index } = this.getPupMaster({ pupId: stateKey })

      // Update it in place.
      if (pup) {
        this.pups[index] = {
          ...this.pups[index],
          state: stateData,
          stats: stats[stateKey],
          assets: assets[stateKey],
        }
        this.pups[index].computed = {
          ...this.pups[index].computed,
          ...this.determineCalculatedVals(this.pups[index])
        }
      }

      if (!pup) {
        let newPup = {
          computed: null,
          def: null,
          state: stateData,
          stats: stats[stateKey],
          assets: assets[stateKey],
        }
        newPup.computed = this.determineCalculatedVals(newPup);
        this.pups.push(newPup);
      }
    }
  }

  determineCalculatedVals(pup) {
    const isInstalled = !!pup.state
    const status = determineStatusId(pup.state, pup.stats);
    const installation = determineInstallationId(pup.state);
    let out;
    try {
      out = {
        isInstalled,
        statusId: status.id,
        statusLabel: status.label,
        installationId: installation.id,
        installationLabel: installation.label,
        // Convention: /explore/:source_id/:pup_name
        storeURL: isInstalled
          ? `/explore/${pup.state.source.id}/${encodeURIComponent(pup.state.manifest.meta.name)}`
          : `/explore/${pup.def.source.id}/${encodeURIComponent(pup.def.key)}`,
        // Convention: /pups/:pup_id/:pup_name
        libraryURL: isInstalled
          ? `/pups/${pup.state.id}/${encodeURIComponent(pup.state.manifest.meta.name)}`
          : null
      }
    } catch (err) {
      console.error('error occurred with computed vals', error);
    }
    return out
  }

  handleSourcesResponse(sources) {
    this.sourcesIndex = sources

    try {
      for (const [sourceId, sourceData] of Object.entries(sources)) {
        for (const [pkgName, pupDefinitionData] of Object.entries(sourceData.pups)) {

          // Do we have this pup in memory?
          const foundIndex = this.pups.findIndex(pup => (
            (pup?.state?.source?.id === sourceId &&
            pup?.state?.manifest?.meta?.name === pkgName)) ||
            (pup?.def?.source?.id === sourceId &&
            pup?.def?.key === pkgName)
          )

          const def = {
            ...pupDefinitionData,
            key: pkgName,
            source: { id: sourceId, lastChecked: sourceData.lastChecked },
          }

          // Update it in place.
          const found = foundIndex >= 0;
          if (found) {
            this.pups[foundIndex] = {
              ...this.pups[foundIndex],
              def
            }
            this.pups[foundIndex].computed = {
              ...this.pups[foundIndex].computed,
              ...this.determineCalculatedVals(this.pups[foundIndex])
            }
          }

          // Not found. create and push to pups array.
          if (!found) {
            let pup = {
              computed: null,
              def,
              state: null,
              stats: null,
              assets: null,
            }
            pup.computed = this.determineCalculatedVals(pup);
            this.pups.push(pup)
          }
        }
      }
    } catch (definitionProcessingError) {
      console.debug('Issue while processing pup definiions')
      console.error(definitionProcessingError);
    }
  }

  getPupMaster({ pupId, sourceId, pupName, lookupType }) {
    try {
      let result = null;
      let index = -1;

      if (this.stateIndex[pupId]) {
        index = this.pups.findIndex(p => p?.state?.id === pupId);
        result = index !== -1 ? this.pups[index] : null;
      }

      if (!result && this.sourcesIndex[sourceId] && this.sourcesIndex[sourceId].pups[pupName]) {
        index = this.pups.findIndex(p => p?.def?.source?.id === sourceId && p?.def?.key === pupName);
        result = index !== -1 ? this.pups[index] : null;
      }

      return { pup: result, index };
    } catch (err) {
      return { pup: null, index: -1 };
    }
  }

  removePupsBySourceId(sourceId) {
    this.pups = this.pups.filter(p => p.def.source.id !== sourceId);
    if (this.sourcesIndex[sourceId]) {
      delete this.sourcesIndex[sourceId];
    }
    this.notify();
  }

  registerAction(txn, callbacks, actionType, pupId, timeout) {
    if (!txn || !callbacks || !actionType || !pupId) {
      console.warn(
        `
        pkgController: MALFORMED REGISTER ACTION REQUEST.
        Expecting: txn, callbacks, actionType & pupId`,
        { txn, callbacks, actionType, pupId },
      );
      return;
    }

    if (typeof callbacks.onSuccess !== "function") {
      console.warn("pkgController: ACTION SUCCESS CALLBACK NOT A FUNCTION.", {
        txn,
        callbacks,
      });
      return;
    }

    if (typeof callbacks.onError !== "function") {
      console.warn("pkgController: ACTION ERROR CALLBACK NOT A FUNCTION.", {
        txn,
        callbacks,
      });
      return;
    }

    const issuedAt = Date.now();
    const expireAt = timeout ? issuedAt + timeout : false;

    this.actions.push({
      txn,
      callbacks,
      actionType,
      pupId,
      issuedAt,
      expireAt,
    });
  }

  resolveAction(txn, payload) {
    const foundActionIndex = this.actions.findIndex(
      (action) => action.txn === txn,
    );
    const foundAction =
      foundActionIndex !== -1 ? this.actions[foundActionIndex] : null;
    if (!foundAction) {
      console.warn("pkgController: ACTION NOT FOUND.", { txn });
      return;
    }

    // Txn failed, invoke error callback.
    if (!payload || payload.error) {
      try {
        // Remove action from actions list.
        this.actions.splice(foundActionIndex, 1);
        // Invoke error callback
        foundAction.callbacks.onError(payload);
      } catch (err) {
        console.warn("the provided onError callback function threw an error");
      }
      return;
    }

    switch (foundAction.actionType) {
      case "UPDATE-PUP":
        this.updatePupModel(foundAction.pupId, payload.update);
        break;
      case "PUP-ACTION":
        // TODO.
        if (foundAction.pupId === "--") {
          return;
        }
        this.updatePupModel(foundAction.pupId, payload.update);
        break;
    }

    // Txn succeeded, invoke success callback.
    try {
      // Remove action from actions list.
      this.actions.splice(foundActionIndex, 1);
      // Invoke success callback
      foundAction.callbacks.onSuccess(payload);
    } catch (err) {
      console.warn("the provided onSuccess callback function threw an error");
    }
  }

  updatePupStatsModel(pupId, newPupStatsData) {
    if (this.stateIndex[newPupStatsData.id]) {
      // Update index data in place.
      this.statsIndex[newPupStatsData.id] = newPupStatsData

      // Update pup array data in place
      const foundIndex = this.pups.findIndex(p => p?.state?.id === newPupStatsData.id)
      if (foundIndex >= 0) {
        this.pups[foundIndex].stats = newPupStatsData;
        this.pups[foundIndex].computed = this.determineCalculatedVals(this.pups[foundIndex])
      }

      // Notify subscribers of change
      this.notify();

    } else {
      // Not handled.  Pup stats data only updated if pup is in memory.
      // Todo. Reconsider this assumption as needed.
    }
  }

  updatePupModel(pupId, newPupStateData) {
    if (!isValidState(newPupStateData)) {
      console.warn("Validation error. Invalid pupState structure");
      return;
    }

    const n = newPupStateData
    console.debug('PUPS ARRAY', { pups: this.pups, stateIndex: this.stateIndex})
    console.debug('Attempting to find in PUPS using', { pupId: n.id, sourceId: n.source.id, pupName: n.manifest.meta.name })
    const { pup, index } = this.getPupMaster({ pupId: n.id, sourceId: n.source.id, pupName: n.manifest.meta.name });

    if (pup) {
      console.debug('Pup found, updating in place');
      this.stateIndex[newPupStateData.id] = newPupStateData

      // Update pup array data in place
      let updated = {
        ...this.pups[index],
        state: newPupStateData,
      }

      updated.computed = this.determineCalculatedVals(updated)

      console.debug('this is the found pup, now with updated state', { updated })

      this.pups[index] = updated
    } else {
      console.debug('Pup NOT found, adding new');
      // When receiving a pupState event for a pup NOT found in the stateIndex
      // We add it as a new entry.  This is likely a record for a newly installed pup
      // The user has clicked "install", and the client has received a pup event before
      // the user has called /bootstrap.
      let pup = {
        computed: null,
        def: toEnrichedDef(this.sourcesIndex[newPupStateData.source.id]?.pups[newPupStateData.manifest.meta.name] || null),
        state: newPupStateData,
        assets: null,
        stats: this.statsIndex[newPupStateData.id] || null,
      }
      pup.computed = this.determineCalculatedVals(pup);

      console.debug('this is the pup to be added', { pup })

      this.stateIndex[pup.state.id] = newPupStateData;
      this.pups.push(pup)
    }

    // Notify subscribers of change
    this.notify();
  }

  async requestPupChanges(pupId, newData, callbacks) {
    if (!pupId || !newData || !callbacks) {
      console.warn(
        "Error. requestPupChanges expected pupId, newData, callbacks",
        { pupId, newData, callbacks },
      );
    }

    const actionType = "UPDATE-PUP";

    // Make a network call
    const res = await postConfig(pupId, newData).catch((err) => {
      console.error(err);
    });

    if (!res || res.error) {
      callbacks.onError({
        error: true,
        message: "failure occured when calling postConfig",
      });
      return false;
    }

    // Submitting changes succeeded, carry on.
    const txn = res.id;
    if (txn && callbacks) {
      // Register transaction in actions register.
      this.registerAction(txn, callbacks, actionType, pupId);
    }

    // Return truthy to caller
    return true;
  }

  async requestPupAction(pupId, action, callbacks, body) {
    if (!pupId || !action || !callbacks) {
      console.warn(
        "Error. requestPupAction expected pupId, action, callbacks",
        { pupId, action, callbacks },
      );
    }

    const actionType = "PUP-ACTION";
    const timeoutMs = 45000; // 45 seconds

    // Make a network call
    const res = await pickAndPerformPupAction(pupId, action, body).catch(
      (err) => {
        console.error(err);
      },
    );

    if (!res || res.error) {
      callbacks.onError({
        error: true,
        message: "failure occured when calling postConfig",
      });
      return false;
    }

    // Submitting changes succeeded, carry on.
    const txn = res.id;
    if (txn && callbacks) {
      // Register transaction in actions register.
      this.registerAction(txn, callbacks, actionType, pupId, timeoutMs);
    }

    // Return truthy to caller
    return true;
  }

  transactionTimeoutChecker() {
    setInterval(() => {
      if (this.actions.length === 0) return;
      this.actions.forEach((a) => {
        if (!a.expireAt) return;

        if (
          Date.now() > a.expireAt &&
          typeof a.callbacks.onTimeout === "function"
        ) {
          try {
            const registeredActionIndex = this.actions.findIndex(
              (b) => b.id === a.id,
            );
            this.actions.splice(registeredActionIndex, 1);
            a.callbacks.onTimeout();
          } catch (err) {
            console.warn(
              "registered onTimeout fn for txn threw an error when called",
            );
          }
        }
      });
    }, 1000);
  }

  getInstalledPupsForSource(sourceId) {
    return this.pups.filter(p => p.state?.source?.id === sourceId);
  }

  getSourceList() {
    if (!pkgController.sourcesIndex) {
      return [];
    }

    return Object.entries(pkgController.sourcesIndex).map(([sourceId, sourceData]) => {

      const installedPupsForSource = pkgController.getInstalledPupsForSource(sourceId);
      const installedCount = installedPupsForSource.length;

      return {
        sourceId: sourceId,
        location: sourceData.location || "",
        name: sourceData.name || "",
        pupCount: Object.keys(sourceData.pups || {}).length,
        installedCount
      };
    });
  }
}

// Instance holder
let instance;

function getInstance() {
  if (!instance) {
    instance = new PkgController();
  }
  return instance;
}

export const pkgController = getInstance();

function toArray(object) {
  return Object.values(object);
}

function isValidState(pupState) {
  // TODO. PupState validity check
  return !!(pupState && pupState.manifest);
}

function toObject(array) {
  return array.reduce((obj, value, index) => {
    obj[index] = value;
    return obj;
  }, {});
}

function determineInstallationId(state) {
  const installation = state?.installation;

  if (!installation) {
    return { id: "not_installed", label: "not installed" };
  }

  if (installation === "installing") {
    return { id: "installing", label: "installing" };
  }

  if (installation === "ready" || installation === "unready") {
    return { id: installation, label: "installed" };
  }

  if (installation === "broken") {
    return { id: "broken", label: "broken" };
  }

  if (installation === "uninstalling") {
    return { id: "uninstalling", label: "uninstalling" };
  }

  if (installation === "uninstalled") {
    return { id: "uninstalled", label: "uninstalled" };
  }

  if (installation === "purging") {
    return { id: "purging", label: "cleaning" };
  }

  return { id: "unknown", label: "unknown" };
}

function determineStatusId(state, stats) {
  const installation = state?.installation;
  const status = stats?.status;
  const flags = {
    needs_deps: state?.needsDeps,
    needs_config: state?.needsConf,
  };

  if (installation === "uninstalling") {
    return { id: "uninstalling", label: "Uninstalling" };
  }

  if (installation === "uninstalled") {
    return { id: "uninstalled", label: "Uninstalled" };
  }

  if (flags.needs_deps) {
    return { id: "needs_deps", label: "Unmet Dependencies" };
  }

  if (flags.needs_config) {
    return { id: "needs_config", label: "Needs Config" };
  }

  if (status === "starting") {
    return { id: "starting", label: "starting" };
  }

  if (status === "running") {
    return { id: "running", label: "running" };
  }

  if (status === "stopping") {
    return { id: "stopping", label: "stopping" };
  }

  if (status === "stopped") {
    return { id: "stopped", label: "stopped" };
  }

  return { id: "unknown", label: "unknown" };
}

function toEnrichedDef(input) {
  console.debug({ input });
  return input;
}