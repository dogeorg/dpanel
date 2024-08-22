import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import "/components/views/action-login/index.js";

class PageLogin extends LitElement {

  render() {
    return html`
      <x-action-login></x-action-login>
    `;
  }
}

customElements.define('x-page-login', PageLogin);