import { html, unsafeHTML } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

export function renderSectionDesc() {
  return html`
    <sl-tab slot="nav" panel="about">About</sl-tab>
    <sl-tab-panel name="about">
      ${
        // TODO: replace with safe markdown renderer.
        this.docs && unsafeHTML(this.docs.about)
      }
    </sl-tab-panel>
  `
}
