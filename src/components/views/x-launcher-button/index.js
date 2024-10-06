import { LitElement, html, css } from "/vendor/@lit/all@3.1.2/lit-all.min.js";
import { themes } from "/components/common/dynamic-form/themes.js";
import { asyncTimeout } from "/utils/timeout.js";
import { getIP } from "/api/reflector/get-ip.js";
import "/components/common/text-loader/text-loader.js";

class DogeboxLauncherButton extends LitElement {

  static get properties() {
    return {
      reflectorToken: { type: String },
      _ready: { type: Boolean },
      _ip: { type: String }
    }
  }

  constructor() {
    super();
    this._ready = false;
    this.ip = "";
    this._serverFault = false;
  }

  firstUpdated() {
    this._intervalId = setInterval(() => {
      if (this._ready) {
        clearInterval(this._intervalId);
      } else {
        this.check();
      }
    }, 3000);
  }

  disconnectedCallback() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
    }
  }

  handleError(e) {
    clearInterval(this._intervalId);
    this._serverFault = true;
    console.error("Failed to contact reflector", e);
    this.requestUpdate();
  }

  async check() {
    try {
      const res = await getIP(this.reflectorToken);
      if (res.ip) {
        this._ip = res.ip;
        this._ready = true;
      }
    } catch (e) {
      this.handleError(e)
    }
  }

  static styles = [themes, css`
    .action-wrap {
      display: flex;
      flex-direction: row;
      gap: 1em;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    span.side-text {
      color: #ccc;
      font-size: 0.9rem;
      font-family: var(--sl-font-sans);
    }
  `];

  render() {
    if (this._serverFault) {
      return html`
        <div class="action-wrap">
          <sl-alert variant="danger" open>
            <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
            Failed to determine your Dogebox IP address. Please refresh to try and connect, or join the Dogebox Discord server if the problem persists.
          </sl-alert>
        </div>
      `;
    }

    return html`
      <div class="action-wrap">
        <sl-tooltip content=${this._ready ? this._ip : "Dogebox IP unknown"}>
          <sl-button size="large" href="http://${this._ip}:8080" target="_blank" ?disabled=${!this._ready} variant="${this._ready ? "primary" : null }">Launch Dogebox</sl-button>
        </sl-tooltip>
        <span class="side-text" href="http://${this._ip}">
          <text-loader .texts=${["Checking", "HOdL tight"]} ?loopEnd=${this._ready} endText="${this._ip}" loop></text-loader>
        </span>
      </div>
    `;
  }
}

customElements.define('x-launcher-button', DogeboxLauncherButton);
