import { html, choose, unsafeHTML } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export function renderDialog() {
  const pkg = this.context.store.pupContext
  const readmeEl = html`${unsafeHTML(pkg?.manifest?.docs?.about)}`
  const configEl = html`
    <dynamic-form
      .values=${{}}
      .fields=${pkg?.manifest?.command?.config}
      requireCommit
      markModifiedFields
      allowDiscardChanges
    >
    </dynamic-form>
  `

  return html`
    <sl-dialog ?open=${this.open_dialog} label=${this.open_dialog_label}>
      ${choose(this.open_dialog, [
        ['readme', () => readmeEl],
        ['configure', () => configEl]
      ],
      () => html`<span>View not provided: ${this.open_dialog}</span>`)}
    </sl-dialog>
  `
}