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

  static properties = {
    pupId: { type: String },
    pupName: { type: String },
    version: { type: String },
    icon: { type: String },
    stats: { type: Object },
    running: { type: Boolean },
  }

  constructor() {
    super();
    this.stats = {}
    this.configManifest = mockConfig // TODO, dont use mock data.
    this.running = Boolean(Math.random() < 0.5); // random true or false.
    
    // Bind all imported renderMehtods to 'this'
    bindToClass(renderMethods, this)
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
