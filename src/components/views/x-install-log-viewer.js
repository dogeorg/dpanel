import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

class InstallLogViewer extends LitElement {
  static get properties() {
    return {
      logs: { type: Array },
      follow: { type: Boolean },
      expanded: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.logs = [];
    this.follow = true;
    this.expanded = false;
  }

  render() {
    return html`
      <div>
        <div id="LogContainer">
          <ul>
            ${this.logs.map(log => html`<li>${log}</li>`)}
          </ul>
        </div>
        <div id="LogFooter">
          <div class="options">
            <sl-checkbox
              size="small"
              ?checked=${this.follow}
              @sl-change=${this.handleFollowChange}
            >Auto scroll</sl-checkbox>
          </div>
          <div class="more-options">
            <sl-button 
              variant="text"
              target="_blank"
              @click=${this.handleDownloadClick}
            >Download
              <sl-icon name="download" slot="suffix"></sl-icon>
            </sl-button>
            <sl-button 
              variant="text"
              @click=${() => this.expanded = !this.expanded}
            >${!this.expanded ? "Expand" : "Collapse"}
              <sl-icon name="${!this.expanded ? 'arrows-expand' : 'arrows-collapse'}" slot="suffix"></sl-icon>
            </sl-button>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        --log-footer-height: 48px;
        --log-viewer-height: 120px;
        display: block;
        position: relative;
        margin-top: 1em;
      }

      :host([expanded]) {
        --log-viewer-height: 400px;
      }

      div#LogContainer {
        background: #0b0b0b;
        padding: 0.5em;
        height: var(--log-viewer-height);
        overflow-y: scroll;
        overflow-x: hidden;
        box-sizing: border-box;
      }

      div#LogFooter {
        display: none /*block*/;
        height: var(--log-footer-height);
        background: rgb(24, 24, 24);
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0em .5em 0em 1em;
        box-sizing: border-box;

        .more-options {
          display: flex;
          flex-direction: row;
          gap: .5em;
        }
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

customElements.define('x-install-log-viewer', InstallLogViewer);

 
