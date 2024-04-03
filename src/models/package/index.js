export class PkgController {
  host;
  installed = [];
  available = [];

  constructor(host) {
    this.host = host;
    host.addController(this);
  }

  setData(data) {
    this.installed = data.local.installed;
    this.available = data.local.available;
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