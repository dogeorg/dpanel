import { postConfig } from "/api/config/config.js";
import { pickAndPerformPupAction } from "/api/action/action.js";

class PkgController {
  observers = [];
  actions = [];

  // Installed packages on system
  installedPackageIndex = {};
  installedPackages = [];

  // Available packges to install.
  packageDefinitionIndex = {};
  pacakgeDefinitions = [];

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

  ingestInstalledPup(states, stats) {
    // Convert to array, enrich each state object.
    this.installedPackages = toArray(states)
      .map(s => toEnrichedInstalledPup(s, stats[s.id]));

    // Index by id.
    this.installedPackageIndex = this.installedPackages
      .toObject({ key: 'id' });
  }

  ingestAvailablePupDefs(storeListingRes) {
    this.packageDefinitionIndex = storeListingRes;
    this.packageDefinitions = toFlattenedAvailablePupsArray(storeListingRes);
    this.notify();
  }

  getPupDefinition(sourceId, pupId) {
    const pup = this.packageDefinitions.find(
      p => p.source.id === sourceId && p.id === pupId
    );
    return pup;
  }

  getInstalledVersion(sourceId, pupId) {
    const pup = this.packageDefinitions.find(
      p => p.source.id === sourceId && p.id === pupId
    );
    const installedVersion = pup.versions.find(
      v => v.version === pup.installedVersion
    )
    return installedVersion;
  }

  setData(bootstrapResponseV2) {
    const { states, stats } = bootstrapResponseV2;
    this.ingestInstalledPup(states, stats);
    this.notify();
  }

  getPup(id) {
    if (!id) return;
    const key = Object.keys(this.installedPackageIndex).find(
      (key) => key.toLowerCase() === id.toLowerCase(),
    );
    return this.installedPackageIndex[key];
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
      expireAt
    });
  }

  resolveAction(txn, payload) {
    const foundAction = this.actions.find((action) => action.txn === txn);
    if (!foundAction) {
      console.warn("pkgController: ACTION NOT FOUND.", { txn });
      return;
    }

    // Txn failed, invoke error callback.
    if (!payload || payload.error) {
      try {
        foundAction.callbacks.onError(payload);
      } catch (err) {
        console.warn("the provided onError callback function threw an error");
      }
      return;
    }

    // Txn succeeded, invoke success callback.
    try {
      foundAction.callbacks.onSuccess(payload);
    } catch (err) {
      console.warn("the provided onSuccess callback function threw an error");
    }

    switch (foundAction.actionType) {
      case "UPDATE-PUP":
        this.updatePupModel(foundAction.pupId, payload.update);
        break;
      case "PUP-ACTION":
        this.updatePupModel(foundAction.pupId, payload.update);
        break;
    }
  }

  updatePupStatsModel(pupId, newPupStatsData) {
    // Update the pup in the pupIndex
    if (this.pupIndexV2[pupId]) {
      console.log('THIS IS THE CASE', this.pupIndexV2[pupId]);
      this.pupIndexV2[pupId] = toEnrichedInstalledPup(this.pupIndexV2[pupId], newPupStatsData);
      console.log('ENRICHED!', this.pupIndexV2[pupId]);
      this.notify(pupId);
    } else {
      console.log('Nope.', pupId);
    }
  }

  updatePupModel(pupId, newPupStateData) {
    // Update the pup in the installed list
    // const installedIndex = this.installed.findIndex(pup => pup.manifest.id === pupId);
    // if (installedIndex !== -1) {
    //   const installedPup = this.installed[installedIndex];
    //   // Update the installed pup with new data
    //   this.installed[installedIndex] = { ...installedPup, ...newData };
    // }

    // Update the pup in the pupIndex
    if (this.pupIndex[pupId]) {
      const indexedPup = this.pupIndex[pupId];
      // Update the indexed pup with new data
      this.pupIndex[pupId] = {
        ...indexedPup,
        state: {
          ...indexedPup.state,
          ...newPupStateData,
        },
        computed: generateComputedVals(this.pupIndex[pupId].manifest, { ...indexedPup.state, ...newPupStateData })
      };

      // Request an update to re-render the host with new data
      this.notify(pupId);
    }
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
    const timeoutMs = 3000; // 3 seconds

    // Make a network call
    const res = await pickAndPerformPupAction(pupId, action, body).catch((err) => {
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

        if (Date.now() > a.expireAt && typeof a.callbacks.onTimeout === "function") {
          try {
            const registeredActionIndex = this.actions.findIndex((b) => b.id === a.id);
            this.actions.splice(registeredActionIndex, 1);
            a.callbacks.onTimeout();
          } catch(err) {
            console.warn('registered onTimeout fn for txn threw an error when called');
          }
        }

      })
    }, 1000);
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

function toAssembledPup(bootstrapResponse) {
  const sources = Object.keys(bootstrapResponse.manifests);
  const states = bootstrapResponse.states;
  const stateKeys = Object.keys(states);
  const out = {
    internal: {},
    installed: {},
    available: {},
  };

  // Populate available index.
  sources.forEach((source) => {
    // sources such as "local", "remote" etc..
    bootstrapResponse.manifests[source].available.forEach((m) => {
      out.available[m.id] = {
        computed: generateComputedVals(m),
        manifest: m,
        state: {
          id: m.id,
          package: m.package,
          ...defaultPupState(),
        },
      };
    });
  });

  // Popupate installed index.
  Object.values(states).forEach((s) => {
    out.installed[s.id] = {
      computed: generateComputedVals(out.available[s.id].manifest, s),
      manifest: out.available[s.id].manifest,
      state: s,
    };
  });

  // Remove installed pups from available index.
  stateKeys.forEach((k) => {
    delete out.available[k];
  });
  return out;
}

function toArray(object) {
  return Object.values(object);
}

function toObject(array) {
  return array.reduce((obj, value, index) => {
    obj[index] = value;
    return obj;
  }, {});
}

function defaultPupState() {
  return {
    status: undefined,
    stats: undefined,
    config: {},
  };
}

function generateComputedVals(m, s) {
  const id = encodeURIComponent(m.id.toLowerCase());
  const name = encodeURIComponent(m.package.toLowerCase());
  const status = determineStatusId(s);
  const installation = determineInstallationId(s);
  return {
    id: m.id,
    url: {
      gui: `/explore/${id}/${name}/ui`,
      library: `/pups/${id}/${name}`,
      store: `/explore/${id}/${name}`,
    },
    statusId: status.id,
    statusLabel: status.label,
    installationId: installation.id,
    installationLabel: installation.label
  };
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

  return { id: "unknown", label: "unknown" };
}

function determineStatusId(state, stats) {
  const installation = state?.installation;
  const status = stats?.status;
  const flags = {
    needs_deps: state?.needs_deps,
    needs_config: state?.needs_config
  }

  if (installation === "uninstalling") {
    return { id: "uninstalling", label: "Uninstalling" }
  }

  if (installation === "uninstalled") {
    return { id: "uninstalled", label: "Uninstalled" }
  }

  if (flags.needs_deps) {
    return { id: "needs_deps", label: "Missing Dependencies" };
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

// Extend Array prototype (for toObject convenience method)
Array.prototype.toObject = function(options = {}) {
  const key = options.key || 'id';
  return this.reduce((obj, item) => {
    if (item && typeof item === 'object' && key in item) {
      obj[item[key]] = item;
    }
    return obj;
  }, {});
};

function toEnrichedInstalledPup(pupState, pupStats) {
  const id = pupState.id;
  const urlEncodedPupame = encodeURIComponent(pupState.manifest.meta.name.replaceAll(' ', '-')).toLowerCase();
  const urlEncodedSourceName = encodeURIComponent(pupState.source.name.replaceAll(' ', '-')).toLowerCase();
  const stats = pupStats
  const status = determineStatusId(pupState, pupStats);
  const installation = determineInstallationId(pupState);

  return {
    ...pupState,
    stats,
    computed: {
      id: pupState.id,
      url: {
        gui: `/explore/${id}/${urlEncodedPupame}/ui`,
        library: `/pups/${id}/${urlEncodedPupame}`,
        store: `/explore/${urlEncodedSourceName}/${urlEncodedPupame}`,
      },
      statusId: status.id,
      statusLabel: status.label,
      installationId: installation.id,
      installationLabel: installation.label
    }
  }
}

function toFlattenedAvailablePupsArray(sources) {
  const pupsArray = [];

  for (const [sourceName, sourceData] of Object.entries(sources)) {
    for (const [pupName, pupData] of Object.entries(sourceData.pups)) {

      const versions = Object.entries(pupData.versions).map(([version, versionData]) => ({
        version,
        ...versionData
      }));


      const installedVersionNumber = pupData.installedVersion;
      const versionLatest = pupData.latestVersion && versions.find(v => v.version === pupData.latestVersion) || {}
      const versionInstalled = pupData.isInstalled && versions.find(v => v.version === installedVersionNumber) || {}
      const versionOutdated = pupData.isInstalled && pupData.latestVersion !== pupData.installedVersion;

      // COMPUTED
      const status = determineStatusId({});
      const installation = determineInstallationId(pupData);
      const urlEncodedSourceName = encodeURIComponent(sourceName.replaceAll(' ', '-')).toLowerCase();
      const urlEncodedPupName = encodeURIComponent(pupName.replaceAll(' ', '-')).toLowerCase();
      const installedId = pupData.installedId

      const pup = {
        id: urlEncodedPupName,
        source: { id: sourceName, lastUpdated: sourceData.lastUpdated },
        ...pupData,
        versionOutdated,
        versionInstalled,
        versionLatest,
        versions,
        computed: {
          url: {
            store: `/explore/${urlEncodedSourceName}/${urlEncodedPupName}`,
            library: `/pups/${installedId}/${urlEncodedPupName}`,
          },
          statusId: status.id,
          statusLabel: status.label,
          installationId: installation.id,
          installationLabel: installation.label
        }
      };
      pupsArray.push(pup);
    }
  }

  return pupsArray;
}
