import { html, choose, unsafeHTML } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export function renderDialog() {
  const pkg = this.context.store.pupContext
  const readmeEl = html`${unsafeHTML(pkg?.manifest?.docs?.about)}`

  return html`
    ${choose(this.open_dialog, [
      ['readme', () => readmeEl],
    ],
    () => html`<span>View not provided: ${this.open_dialog}</span>`)}
  `
}