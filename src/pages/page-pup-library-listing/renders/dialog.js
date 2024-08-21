import {
  html,
  choose,
  unsafeHTML,
} from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export function renderDialog() {
  const pkg = this.pkgController.getPup(this.pupId);
  const { statusId } = pkg.computed
  const readmeEl = html`${unsafeHTML(pkg?.manifest?.docs?.about)}`;
  const depsEl = pkg.manifest.deps.pups.length > 0 
    ? pkg.manifest.deps.pups.map((dep) => html`
      <action-row prefix="box-seam" name=${dep.id} label=${dep.name} href=${`/explore/${dep.id}/${dep.name}`}>
        ${dep.condition}
      </action-row>`)
    : html`<div style="padding: 1em; text-align: center;"> Such empty. This pup depends on no other.</div>
  `;

  const preventUninstallEl = html`
    <p>Cannot uninstall a running Pup.<br/>Please disable ${pkg.manifest.package } and try again.</p>
    <sl-button slot="footer" variant="primary" @click=${this.clearDialog}>Dismiss</sl-button>
    <style>p:first-of-type { margin-top: 0px; }</style>
  `

  const uninstallEl = html`
    <p>Are you sure you want to uninstall ${pkg.manifest.package  }?</p>
    <sl-input placeholder="Type '${pkg.manifest.package}' to confirm" @sl-input=${(e) => this._confirmedName = e.target.value }></sl-input>
    <sl-button slot="footer" variant="danger" @click=${this.handleUninstall} ?loading=${this.inflight} ?disabled=${this.inflight || this._confirmedName !== pkg.manifest.package}>Uninstall</sl-button>
    <style>p:first-of-type { margin-top: 0px; }</style>
  `;

  const configEl = html`
    <dynamic-form
      .values=${pkg?.state?.config}
      .fields=${pkg?.manifest?.command?.config}
      .onSubmit=${this.submitConfig}
      requireCommit
      markModifiedFields
      allowDiscardChanges
    >
    </dynamic-form>
  `;

  const isStopped = !this.pupEnabled && statusId !== "running";

  return html`
    ${choose(
      this.open_dialog,
      [
        ["readme", () => readmeEl],
        ["deps", () => depsEl],
        ["configure", () => configEl],
        ["uninstall", () => isStopped ? uninstallEl : preventUninstallEl],
      ],
      () => html`<span>View not provided: ${this.open_dialog}</span>`,
    )}
  `;
}

