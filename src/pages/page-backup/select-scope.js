import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import "/components/views/action-backup/index.js";

class PageBackup extends LitElement {

  static styles = css`
    :host {
      display: block;
      padding: 20px;
    }
  `

  render() {
    return html`
      <x-action-backup></x-action-backup>
    `;
  }
}

customElements.define('x-page-backup', PageBackup);