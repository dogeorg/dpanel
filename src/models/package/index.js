export class PkgController {
  host;
  pups = {};
  installed = [];
  available = [];

  constructor(host) {
    this.host = host;
    host.addController(this);
  }

  setData(bootstrapResponse) {
    this.pups = toAssembledPup(bootstrapResponse);
    this.installed = toArray(toAssembledPup(bootstrapResponse))
    this.available = bootstrapResponse.manifests.local.available;
    this.host.requestUpdate();
  }

  installPkg(pupId) {
    // Find the pup in the available list
    const index = this.available.findIndex(pup => pup.package === pupId);
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
  const out = {}
  sources.forEach((source) => {
    // sources such as "local", "remote" etc..
    bootstrapResponse.manifests[source].installed.forEach((entry) => {
      out[entry] = {
        manifest: entry,
        state: bootstrapResponse.states[entry.package]
      }
    })
  })
  return out;
}

function toArray(object) {
  return Object.values(object);
}