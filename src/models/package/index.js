export class PkgController {
  host;
  pupIndex = {};
  installed = [];
  available = [];

  constructor(host) {
    this.host = host;
    host.addController(this);
  }

  setData(bootstrapResponse) {
    const { installed, available } = toAssembledPup(bootstrapResponse)
    this.installed = toArray(installed)
    this.available = toArray(available)
    this.pupIndex = { ...available, ...installed }
    this.host.requestUpdate();
  }

  installPkg(pupId) {
    // Find the pup in the available list
    const index = this.available.findIndex(pup => pup.manifest.package === pupId);
    if (index !== -1) {
      // Move the pup from the available list to the installed list
      const [pup] = this.available.splice(index, 1);
      this.installed.push(pup);
      this.host.requestUpdate();
    }
  }

  removePkg(pupId) {
    // Find the pup in the installed list
    const index = this.installed.findIndex(pup => pup.id === pupId);
    if (index !== -1) {
      // Remove the pup from the installed list
      this.installed.splice(index, 1);
      this.host.requestUpdate();
    }
  }
}
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