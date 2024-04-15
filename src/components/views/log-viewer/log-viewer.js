import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import { WebSocketClient } from '/api/sockets.js';

class LogViewer extends LitElement {
  static get properties() {
    return {
      logs: { type: Array },
      isConnected: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.logs = [];
    this.isConnected = false;
    this.wsClient = null;
  }

  connectedCallback() {
    super.connectedCallback();
    const networkContext = { useMocks: window.networkContext.useMocks };
    this.wsClient = new WebSocketClient('wss://logs.dogebox.server/pupid', networkContext);
    
    // Update component state based on WebSocket events
    this.wsClient.onOpen = (event) => {
      this.isConnected = true;
      this.requestUpdate();
    };

    this.wsClient.onMessage = (event) => {
      this.logs = [...this.logs, event.data];
      this.requestUpdate();
    };

    this.wsClient.onError = (event) => {
      this.isConnected = false;
      this.requestUpdate();
    };

    this.wsClient.onClose = (event) => {
      this.isConnected = false;
      this.requestUpdate();
    };

    this.wsClient.connect();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Clean up WebSocket connection
    this.wsClient && this.wsClient.socket && this.wsClient.socket.close();
  }

  render() {
    return html`
      <div>
        <h2>Log Viewer</h2>
        <div>Connection Status: ${this.isConnected ? 'Connected' : 'Disconnected'}</div>
        <ul>
          ${this.logs.map(log => html`<li>${log}</li>`)}
        </ul>
      </div>
    `;
  }

  static get styles() {
    return css`
      ul {
        list-style-type: none;
        padding: 0;
      }
      li {
        background: #f0f0f0;
        margin: 5px 0;
        padding: 5px;
        border-radius: 5px;
      }
    `;
  }
}

customElements.define('log-viewer', LogViewer);
