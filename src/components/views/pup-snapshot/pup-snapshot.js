import { LitElement, html, nothing } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import { bindToClass } from '/utils/class-bind.js'
import { styles } from './pup-snapshot.styles.js';
import '/components/common/dynamic-form/dynamic-form.js'
import '/components/common/animated-dots.js'
import '/components/common/sparkline-chart/sparkline-chart.js'
import * as mockConfig from '/components/common/dynamic-form/mocks/index.js'

// Import component chunks
import * as renderMethods from './renders/index.js';

class PupSnapshot extends LitElement {

  static get properties() {
    return {
      // From manifest
      pupId: { type: String },
      pupName: { type: String },
      version: { type: String },
      icon: { type: String },
      disabled: { type: Boolean },
      config: { type: Object },
      focus: { type: String, reflect: true },
      activeTab: { type: String },
      installed: { type: Boolean },
      docs: { type: Object },

      // From state
      status: { type: String },
      running: { type: Boolean },
      stats: { type: Object },
      options: { type: Object },
    }
  }

  constructor() {
    super();
    this.stats = {}
    this.running = false;
    this.activeTab = null;
    // Bind all imported renderMehtods to 'this'
    bindToClass(renderMethods, this)
  }

  get status() {
    return this._status;
  }

  set status(newStatus) {
    this._status = newStatus;
    this.running = newStatus === 'running';
    this.requestUpdate();
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('sl-tab-show', this.handleTabChange.bind(this));
  }

  disconnectedCallback() {
    this.removeEventListener('sl-tab-show', this.handleTabChange.bind(this));
    super.disconnectedCallback();
  }

  handleTabChange(event) {
    const tabGroup = this.shadowRoot.querySelector('sl-tab-group#PupTabs');
    if (event.originalTarget === tabGroup) {
      this.activeTab = event.detail.name
    }
  }

  jumpToTab(tabName) {
    // Expand details (if not expanded already)
    const detailsPanel = this.shadowRoot.querySelector('sl-details')
    detailsPanel.show();

    // Reveal specific tab
    if (!tabName) return;
    const tabGroup = this.shadowRoot.querySelector('sl-tab-group#PupTabs');
    tabGroup.show(tabName);

  }

  render() {
    return html`
      <sl-details>
        <div class="summary" slot="summary">
          ${this.renderSummary()}
        </div>

        <div class="content">
          <sl-tab-group id="PupTabs">
            ${this.installed ? html`
              ${this.renderSectionLogs()}
              ${this.renderSectionStats()}
              ${this.renderSectionConfig()}
              ${this.renderSectionDesc()}
              ${this.renderSectionScreens()}
            ` : nothing
            }

            ${!this.installed ? html`
              ${this.renderSectionDesc()}
              ${this.renderSectionScreens()}
            ` : nothing
            }
          </sl-tab-group>
        </div>
      </sl-details>
    `;
  }

  static styles = styles;
}

customElements.define('pup-snapshot', PupSnapshot);
