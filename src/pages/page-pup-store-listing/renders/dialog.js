import { html, choose, unsafeHTML } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export function renderDialog() {
  const pupDefinitionContext = this.context.store?.pupDefinitionContext
  const pkg = this.pkgController.getPupDefinition(pupDefinitionContext.source.id, pupDefinitionContext.id);
  const readmeEl = html`<div style="padding: 1em; text-align: center;"> Such empty. This pup does not provide a README.</div>`;

  return html`
    ${choose(this.open_dialog, [
      ['readme', () => readmeEl],
    ],
    () => html`<span>View not provided: ${this.open_dialog}</span>`)}
  `
}