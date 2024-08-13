import { html } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

export function renderSectionStats() {
  return html`
    <sl-tab slot="nav" panel="stats">Stats</sl-tab>
    <sl-tab-panel name="stats">
      This is the stats tab panel.
    </sl-tab-panel>
  `  
}
