
import {
  LitElement,
  html,
  css,
} from "/vendor/@lit/all@3.1.2/lit-all.min.js";

class CreateBackup extends LitElement {
  static styles = css``
  static properties = {

  }

  constructor() {
    super()
  }

  render() {
    return html`<h1>Backup</h1>`
  }
}

customElements.define("x-action-backup", CreateBackup);
