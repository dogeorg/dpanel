import { html, choose, unsafeHTML } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export function renderDialog() {
  const pkg = this.context.store.pupContext

  return html`
    <sl-dialog ?open=${this.open_dialog} label=${this.open_dialog_label}>
      ${choose(this.open_dialog, [
        ['readme', () => html`${unsafeHTML(pkg?.manifest?.docs?.about)}`],
        ['configure', () => html`Configurator here.`]
      ],
      () => html`<span>View not provided</span>`)}
    </sl-dialog>
  `
}