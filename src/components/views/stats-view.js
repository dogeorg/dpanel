import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

class StatsView extends LitElement {
  render() {
    return html`
      <sl-tab-group>
        <sl-tab slot="nav" @click=${this.handleClick} panel="about">About</sl-tab>
        <sl-tab slot="nav" panel="custom">Editor</sl-tab>

        <sl-tab-panel name="general">This is the about tab panel.</sl-tab-panel>
        <sl-tab-panel name="custom">This is the custom tab panel.</sl-tab-panel>
      </sl-tab-group>
    `;
  }
  handleClick(event) {
    event.stopPropagation();
    if (window.confirm("Do you really want to leave?")) {
      this.shadowRoot.querySelector('sl-tab-group').show(event.target.panel);
    }
  }
}

customElements.define('stats-view', StatsView);