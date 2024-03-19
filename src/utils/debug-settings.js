import { LitElement, html, css, classMap } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import { StoreSubscriber } from '/state/subscribe.js';
import { store } from '/state/store.js';

class DebugSettingsDialog extends LitElement {
  constructor() {
    super();

    // Subscribe to store
    this.context = new StoreSubscriber(this, store);

    this.isOpen = false;
  }

  static styles = css``;

  connectedCallback() {
    super.connectedCallback();
    
    // Prevent the dialog from closing when the user clicks on the overlay
    const dialog = this.shadowRoot.querySelector('.dialog-deny-close');
    this.addEventListener('sl-request-close', this.denyClose);

  }

  handleToggle(event) {
    const changes = { networkContext: { useMocks: event.target.checked }}
    store.updateState(changes)
  }

  render() {
    const { networkContext, appContext } = this.context.store
    return html`
      <sl-dialog ?open=${this.isOpen} class="dialog-deny-close" no-header>
        <form @submit=${this.handleSubmit}>
          <sl-switch 
            help-text="When enabled, ApiClient returns mocked responses"
            .checked=${networkContext.useMocks}
            @sl-change=${this.handleToggle}
            >Network Mocks</sl-switch>
        </form>
        <div slot="footer">
          <sl-button @click=${this.closeDialog}>Close</sl-button>
        </div>
      </sl-dialog>
    `;
  }

  disconnectedCallback() {
    dialog = this.shadowRoot.querySelector('.dialog-deny-close');
    dialog.removeEventListener('sl-request-close', this.denyClose);
    super.disconnectedCallback();
  }

  denyClose = (event) => {
    if (event.detail.source === 'overlay') {
      event.preventDefault();
    }
  }

  handleSubmit(event) {
    // Prevent the form from submitting
    event.preventDefault();
  }

  openDialog() {
    this.isOpen = true;
    this.requestUpdate(); // Request an update to re-render the component with the dialog open
  }

  closeDialog() {
    this.isOpen = false;
    this.requestUpdate(); // Request an update to re-render the component with the dialog closed
  }

  saveSettings() {
    // Logic to save settings
    console.log('Settings saved!');
    this.closeDialog();
  }
}

customElements.define('debug-settings-dialog', DebugSettingsDialog);