import {
  html,
  choose,
  unsafeHTML,
} from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export function renderDialog() {
  const pkg = this.pkgController.getPup(this.pupId);
  const readmeEl = html`${unsafeHTML(pkg?.manifest?.docs?.about)}`;
  const depsEl = pkg.manifest.deps.pups.length > 0 
    ? pkg.manifest.deps.pups.map((dep) => html`
      <action-row prefix="box-seam" name=${dep.id} label=${dep.name} href=${`/explore/${dep.id}/${dep.name}`}>
        ${dep.condition}
      </action-row>`)
    : html`<div style="padding: 1em; text-align: center;"> Such empty. This pup depends on no other.</div>`

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

  return html`
    ${choose(
      this.open_dialog,
      [
        ["readme", () => readmeEl],
        ["deps", () => depsEl],
        ["configure", () => configEl],
      ],
      () => html`<span>View not provided: ${this.open_dialog}</span>`,
    )}
  `;
}

