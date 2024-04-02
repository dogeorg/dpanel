import { html } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

export function renderSectionLogs() {
  return html`
    <sl-tab slot="nav" panel="logs">Logs</sl-tab>
    <sl-tab-panel name="logs">
      This is the logs tab panel.
    </sl-tab-panel>
  `
}
