import { html, nothing } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

export function renderSectionConfig() {
  return html`
    <sl-tab slot="nav" panel="config">Config</sl-tab>
    <sl-tab-panel name="config">
      ${this.activeTab === 'config'
        ? html`<dynamic-form pupId=${this.pupId} .data=${this.config} orientation="landscape"></dynamic-form>`
        : nothing
      }
    </sl-tab-panel>
  `
}
