import { LitElement, html, nothing } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import { bindToClass } from '/utils/class-bind.js'
import { asyncTimeout } from '/utils/timeout.js'
import { styles } from './pup-snapshot.styles.js';
import '/components/common/dynamic-form/dynamic-form-reuse.js'
import '/components/common/animated-dots.js'
import '/components/common/sparkline-chart/sparkline-chart.js'
import '/components/views/log-viewer/log-viewer.js'
import * as mockConfig from '/components/common/dynamic-form/mocks/index.js'
import { pkgController } from '/models/package/index.js';
import { postConfig } from '/api/config/config.js';

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
      inspected: { type: Boolean },

      // internal state
      _dirty: { type: Number, attribute: false },
      _saved: { type: Boolean, state: true }
    }
  }

  constructor() {
    super();
    this.stats = {}
    this.running = false;
    this.activeTab = null;
    this._dirty = 0;
    this.pkgController = pkgController;
    this.options = {};
    this.config = {};
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
    this.pkgController.addObserver(this);
    this.addEventListener('form-dirty-change', this.handleDirtyChange.bind(this), { composed: true })
    this.addEventListener('form-submit-success', this.handleFormSubmitSuccess.bind(this), { composed: true })
  }

  firstUpdated() {
    const tabs = this.shadowRoot.querySelectorAll('#PupTabs sl-tab')
    tabs.forEach(tab => {
      tab.addEventListener('click', this.handleTabClick.bind(this));
    });
  }

  disconnectedCallback() {
    this.removeEventListener('form-dirty-change', this.handleDirtyChange.bind(this))
    this.removeEventListener('form-submit-success', this.handleFormSubmitSuccess.bind(this), { composed: true })
    this.pkgController.removeObserver(this);
    super.disconnectedCallback();
  }

  handleDirtyChange(event) {
    this._dirty = event.detail.dirty;
  }

  async handleFormSubmitSuccess(event) {
    this._saved = true;
    await asyncTimeout(2000)
    this._saved = false;
  }

  submitPupConfigChanges = async (data) => {
    const res = await postConfig(this.pupId, data);
    await pkgController.savePupChanges(this.pupId, data);
    // Updated PupSnapshots copy of options
    // This will trigger a re-render of the dynamic-form
    await asyncTimeout(4000);

    console.log('--injecting new state returned from server');
    this.options = { ...this.options, ...data }
  }

  handleTabClick(event) {
    // Interupt tab change for a quick check whether there are
    // unsaved changes.
    event.stopPropagation();

    // If not dirty, force tab change.
    if (!this._dirty) {
      this.jumpToTab(event.target.panel)
      return
    }

    // When dirty, ask the user if they want to stay or leave (abaonding changes)
    if (window.confirm("Do you really want to leave?")) {
      this.jumpToTab(event.target.panel)

      // Changes abandoned. Clear the dirt.
      this._dirty = false;
    }
  }

  jumpToTab(tabName) {
    // Emit forced-tab-show event
    this.dispatchEvent(new CustomEvent(
      'forced-tab-show', {
        detail: { tabName, pupId: this.pupId },
        bubbles: true,
        composed: true
      }
    ));

    // Reveal specific tab
    if (!tabName) return;
    this.activeTab = tabName;
    const tabGroup = this.shadowRoot.querySelector('sl-tab-group#PupTabs');
    tabGroup.show(tabName);
  }

  render() {
    return html`
      <sl-details ?open=${this.inspected}>
        <div class="summary" slot="summary">
          ${this.renderSummary()}
        </div>

        <div class="content">
          <sl-tab-group
            id="PupTabs"
            style="--indicator-color: #07ffae;"
          >
            ${this.installed ? html`
              ${this.renderSectionStats()}
              ${this.renderSectionLogs()}
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
