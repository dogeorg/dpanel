import {
  LitElement,
  html,
  css,
  nothing,
} from "/vendor/@lit/all@3.1.2/lit-all.min.js";

import { getSSHPublicKeys } from "/api/sshkeys/sshkeys.js";

export class RemoteAccessSettings extends LitElement {
  static get properties() {
    return {
      _loading: { type: Boolean},
      _server_fault: { type: String },
      _ssh_public_keys: { type: Array },
    }
  }

  static styles = css`
    h1 {
      font-family: "Comic Neue", sans-serif;
      text-align: center;
    }
  `

  constructor() {
    super();
    this._ssh_public_keys = [];
    this._server_fault = "";
  }

  firstUpdated() {
    this.fetchSSHPublicKeys();
  }

  async fetchSSHPublicKeys() {
    // spinner start
    this._loading = true;
    try {
      this._ssh_public_keys = await getSSHPublicKeys();
    } catch (err) {
      // failed to fetch keys
      this._server_fault = err.message;
      console.log('ER', err);
    } finally {
      this._loading = false;
    }
  }

  render() {
    const hasKeys = this._ssh_public_keys.length
    const keys = this._ssh_public_keys 
    return html`
      <h1>Remote Access</h1>

      <sl-button variant="text">Add key</sl-button>
      
      ${hasKeys ? keys.map((k) => {
        return html`<code data-id="${k.id}">${k.key}</code>`
      }) : nothing }

      <sl-textarea name="ssh-key"></sl-textarea>
    `
  }
}

customElements.define('x-action-remote-access', RemoteAccessSettings);