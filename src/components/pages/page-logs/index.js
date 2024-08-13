import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import "/components/views/x-log-viewer/index.js";

class PageLogs extends LitElement {

  render() {
    return html`
      <x-log-viewer></x-log-viewer>
    `;
  }
}

customElements.define('x-page-pup-logs', PageLogs);