import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import { store } from '/state/store.js';
import WebSocketClient from '/api/sockets.js';
import { mockedLogRunner } from './log.mocks.js';

class LogViewer extends LitElement {
  static get properties() {
    return {
      autostart: { type: Boolean },
      logs: { type: Array },
      isConnected: { type: Boolean },
      follow: { type: Boolean },
      pupId: { type: String },
    };
  }

  constructor() {
    super();
    this.logs = [];
    this.pupId = null;
    this.isConnected = false;
    this.wsClient = null;
    this.follow = true;
    this.autostart = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.setupSocketConnection()
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    console.log('Disconnecting log-viewer socket connection');
    // Clean up WebSocket connection
    this.wsClient.disconnect();
  }

  updated(changedProperties) {
    if (changedProperties.has('autostart') && this.autostart) {
      this.wsClient && this.wsClient.connect();
    }
  }

  firstUpdated() {
  const logContainer = this.shadowRoot.querySelector('#LogContainer');
    logContainer.addEventListener('scroll', () => {
      // Check if the user has scrolled up from the bottom
      if (logContainer.scrollTop < logContainer.scrollHeight - logContainer.clientHeight) {
        this.follow = false;
      }
    });
  }

  handleFollowChange(e) {
    this.follow = e.target.checked;
    if (this.follow) {
      const logContainer = this.shadowRoot.querySelector('#LogContainer');
      logContainer.scrollTop = logContainer.scrollHeight;
    }
  }

  handleToggleConnection() {
    if (this.wsClient.isConnected) {
      this.wsClient.disconnect();
    } else {
      this.wsClient.connect();
    }
  }

  setupSocketConnection() {
    if (this.isConnected) {
      return;
    }

    this.wsClient = new WebSocketClient(
      'ws://localhost:3000',
      store.networkContext,
      mockedLogRunner
    );
    
    // Update component state based on WebSocket events
    this.wsClient.onOpen = (event) => {
      this.isConnected = true;
      this.requestUpdate();
    };

    this.wsClient.onMessage = async (event) => {
      this.logs = [...this.logs, event.data];
      await this.requestUpdate();
      if (this.follow) {
        const logContainer = this.shadowRoot.querySelector('#LogContainer');
        logContainer.scrollTop = logContainer.scrollHeight;
      }
    };

    this.wsClient.onError = (event) => {
      this.isConnected = false;
      this.requestUpdate();
    };

    this.wsClient.onClose = (event) => {
      this.isConnected = false;
      this.requestUpdate();
    };

    if (this.autostart) {
      this.wsClient.connect();
    }
  }

  render() {
    return html`
      <div>
        <div id="LogHUD">
          <div class="status">
            ${this.isConnected
              ? html`<sl-tag size="small" pill @click=${this.handleToggleConnection} variant="success">Connected</sl-tag>`
              : html`<sl-tag size="small" pill @click=${this.handleToggleConnection} variant="neutral">Disconnected</sl-tag>`
            }
          </div>
        </div>
        <div id="LogContainer">
          <ul>
            ${this.logs.map(log => html`<li>${log}</li>`)}
          </ul>
        </div>
        <div id="LogFooter">
          <div class="options">
            <sl-checkbox
              size="medium"
              ?checked=${this.follow}
              @sl-change=${this.handleFollowChange}
            >Auto scroll</sl-checkbox>
          </div>
          <sl-button 
            variant="text"
            size="large"
            href="${`${store.networkContext.apiBaseUrl}/logs/${this.pupId}/download`}"
            target="_blank"
            >Download
            <sl-icon name="download" slot="suffix"></sl-icon>
          </sl-button>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        position: relative;
      }
      div#LogHUD {
        position: absolute;
        right: 28px;
        top: 5px;

        display: flex;
        flex-direction: column;
        align-items: end;
      }
      div#LogHUD .status {
        opacity: 0.7;
        cursor: pointer;
      }
      div#LogHUD div {
        opacity: 0.2;
        transition: opacity 250ms ease-out;
      }
      div#LogHUD div:hover {
        opacity: 1;
      }
      div#LogContainer {
        background: #0b0b0b;
        padding: 0.5em;
        height: calc(100vh - 176px);
        overflow-y: scroll;
        overflow-x: hidden;
      }

      div#LogFooter {
        display: block;
        height: 80px;
        background: rgb(24, 24, 24);
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0em 1.5em;
        box-sizing: border-box;
      }
      ul {
        list-style-type: none;
        padding: 0;
        margin: 0px;
      }
      li {
        font-family: 'Courier New', monospace;
        font-size: 0.85rem;
        line-height: 1.1;
        font-weight: bold;
        margin: 0px 0;
        padding: 0px;
      }
    `;
  }
}

customElements.define('log-viewer', LogViewer);
