import { LitElement, html, css } from "/vendor/@lit/all@3.1.2/lit-all.min.js";
import { themes } from "/components/common/dynamic-form/themes.js";
import { asyncTimeout } from "/utils/timeout.js";
import { getIP } from "/api/reflector/get-ip.js";
import "/components/common/text-loader/text-loader.js";

class DogeboxLauncherButton extends LitElement {

  static get properties() {
    return {
      _ready: { type: Boolean },
      _ip: { type: String }
    }
  }

  constructor() {
    super();
    this._ready = false;
    this.ip = "";
  }

  firstUpdated() {
    this._intervalId = setInterval(() => {
      if (this._ready) {
        clearInterval(this._intervalId);
        this._intervalId = setInterval(() => this.check(), 7000);
      } else {
        this.check();
      }
    }, 10000);
  }

  disconnectedCallback() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
    }
  }

  handleError() {
    this._serverFault = true;
  }

  async check() {
    const res = await getIP();
    if (!res || !res.success || res.error || !res.ip) {
      this.handleError(res)
      return;
    }

    this._ip = res.ip;
    this._ready = true;
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
    return html`
      <div class="action-wrap">
        <sl-tooltip content=${this._ready ? this._ip : "Dogebox IP unknown"}>
          <sl-button size="large" href="http://${this._ip}" target="_blank" ?disabled=${!this._ready} variant="${this._ready ? "primary" : null }">Launch Dogebox</sl-button>
        </sl-tooltip>
        <span class="side-text" href="http://${this._ip}">
          <text-loader .texts=${["Checking", "HOdL tight"]} ?loopEnd=${this._ready} endText="${this._ip}" loop></text-loader>
        </span>
      </div>
    `;
  }
}

customElements.define('x-launcher-button', DogeboxLauncherButton);
