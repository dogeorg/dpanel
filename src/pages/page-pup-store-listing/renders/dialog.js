import { html, choose, unsafeHTML } from "/vendor/@lit/all@3.1.2/lit-all.min.js";
import "/components/views/action-dependency-manage/dependency.js";
import "/components/views/action-interface-list/interface.js";

export function renderDialog() {
  const pupContext = this.context.store?.pupContext
  const pkg = this.getPup();
  const readmeEl = html`<div style="padding: 1em; text-align: center;"> Such empty. This pup does not provide a README.</div>`;
  const depsEl = html`<x-action-manage-deps></x-action-manage-deps>`;
  const intsEl = html`<x-action-interface-list></x-action-interface-list>`;

  return html`
    ${choose(this.open_dialog, [
      ['readme', () => readmeEl],
      ['deps', () => depsEl],
      ['ints', () => intsEl],
    ],
    () => html`<span>View not provided: ${this.open_dialog}</span>`)}
  `
}