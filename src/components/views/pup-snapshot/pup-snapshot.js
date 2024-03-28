import { LitElement, html } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
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
      pupId: { type: String },
      pupName: { type: String },
      version: { type: String },
      icon: { type: String },
      stats: { type: Object },
      status: { type: String },
      running: { type: Boolean }
    }
  }

  constructor() {
    super();
    this.stats = {}
    this.running = false;
    this.configManifest = mockConfig // TODO, dont use mock data.

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

  render() {
    return html`
      <sl-details>
        <div class="summary" slot="summary">
          ${this.renderSummary()}
        </div>

        <div class="content">
          <sl-tab-group>
            ${this.renderSectionLogs()}
            ${this.renderSectionStats()}
            ${this.renderSectionConfig()}
          </sl-tab-group>
        </div>
      </sl-details>
    `;
  }

  static styles = styles;
}

customElements.define('pup-snapshot', PupSnapshot);
