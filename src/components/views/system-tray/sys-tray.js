import { LitElement, html, nothing } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import { store } from "/state/store.js";
import { StoreSubscriber } from "/state/subscribe.js";
import { simulateActivity } from './helpers.js';
import { styles } from "./styles.js";

class SystemTray extends LitElement {
  static get properties() {
    return {
      active: { type: Boolean, reflect: true },
      count: { type: Number },
      previousCount: { type: Number },
    }
  }

  constructor() {
    super();
    this.context = new StoreSubscriber(this, store);
    this.count = 0;
    this.previousCount = 0;
    this.active = false;
  }

  static styles = styles;

  updated(changedProperties) {
    if (!this.context) return;
    
    // If the job count decreases
    // Celebrate a little.
    if (changedProperties.has('count')) {
      const oldCount = changedProperties.get('count');
      if (oldCount !== undefined && this.count < oldCount) {
        const celebrateIcon = this.shadowRoot.querySelector('.celebrate');
        celebrateIcon.classList.remove('flash');
        
        // Force reflow (icon will not flash again without this)
        void celebrateIcon.offsetWidth;
        
        celebrateIcon.classList.add('flash');
      }
    }
    
    this.count = this.context.store.jobContext.count;
    this.active = this.count > 0;
  }

  async firstUpdated() {
    await simulateActivity(store);
  }

  render() {
    return html`
      <div class="inner">
        <div>
          ${this.active ? html`
            <sl-icon name="activity" label="Jobs"></sl-icon>
            <span class="text">System Tasks (${this.count})</sl-tag></span>
          ` : html`
            <sl-icon name="activity" label="Jobs"></sl-icon>
            <span class="text">System Tasks</span>
          `}
        </div>

        <sl-icon class="celebrate" name="check-circle-fill"></sl-icon>
      </div>
      <sl-progress-bar class="loader-bar" ?indeterminate=${this.active}></sl-progress-bar>
    `
  }
}

customElements.define('system-tray', SystemTray)