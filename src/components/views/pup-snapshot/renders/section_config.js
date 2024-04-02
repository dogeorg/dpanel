import { html } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

export function renderSectionConfig() {
  return html`
    <sl-tab slot="nav" panel="advanced">Config</sl-tab>
    <sl-tab-panel name="advanced">
      <dynamic-form .data=${this.configManifest.split} orientation="landscape"></dynamic-form>
    </sl-tab-panel>
  `
}
