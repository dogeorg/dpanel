class PkgController {
  observers = [];
  pupIndex = {};
  installed = [];
  available = [];

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

  setData(bootstrapResponse) {
    const { installed, available } = toAssembledPup(bootstrapResponse)
    this.installed = toArray(installed)
    this.available = toArray(available)
    this.pupIndex = { ...available, ...installed }
    this.notify();
  }

  installPkg(pupId) {
    // Find the pup in the available list
    const index = this.available.findIndex(pup => pup.manifest.package === pupId);
    if (index !== -1) {
      // Move the pup from the available list to the installed list
      const [pup] = this.available.splice(index, 1);
      this.installed.push(pup);
      this.notify();
    }
  }

  removePkg(pupId) {
    // Find the pup in the installed list
    const index = this.installed.findIndex(pup => pup.id === pupId);
    if (index !== -1) {
      // Remove the pup from the installed list
      this.installed.splice(index, 1);
      this.notify();
    }
  }

  savePupChanges(pupId, newData) {
    // Update the pup in the installed list
    const installedIndex = this.installed.findIndex(pup => pup.manifest.package === pupId);
    if (installedIndex !== -1) {
      const installedPup = this.installed[installedIndex];
      // Update the installed pup with new data
      this.installed[installedIndex] = { ...installedPup, ...newData };
    }

    // Update the pup in the pupIndex
    if (this.pupIndex[pupId]) {
      const indexedPup = this.pupIndex[pupId];
      // Update the indexed pup with new data
      this.pupIndex[pupId] = { ...indexedPup, ...newData };
    }

    // Request an update to re-render the host with new data
    this.notify(pupId);
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
  const sources = Object.keys(bootstrapResponse.manifests)
  const out = {
    installed: {},
    available: {},
  }
  sources.forEach((source) => {
    // sources such as "local", "remote" etc..
    bootstrapResponse.manifests[source].installed.forEach((entry) => {
      out.installed[entry.package] = {
        manifest: entry,
        state: bootstrapResponse.states[entry.package] || {
          status: undefined,
          stats: undefined,
          options: {},
        }
      }
    })
    bootstrapResponse.manifests[source].available.forEach((entry) => {
      out.available[entry.package] = {
        manifest: entry,
        state: {
          ...defaultPupState()
        },
      }
    })
  })
  return out;
}

function toArray(object) {
  return Object.values(object);
}

function defaultPupState() {
  return {
    status: undefined,
    stats: undefined,
    options: {}
  }
}