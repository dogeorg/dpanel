import {
  LitElement,
  html,
  css,
  classMap,
} from "/vendor/@lit/all@3.1.2/lit-all.min.js";
import { StoreSubscriber } from "/state/subscribe.js";
import { store } from "/state/store.js";

class DebugSettingsDialog extends LitElement {
  constructor() {
    super();

    // Subscribe to store
    this.context = new StoreSubscriber(this, store);

    this.isOpen = false;
  }

  static styles = css`
    .form-control {
      margin-bottom: 1.5em;
    }
  `;

  connectedCallback() {
    super.connectedCallback();

    // Prevent the dialog from closing when the user clicks on the overlay
    const dialog = this.shadowRoot.querySelector(".dialog-deny-close");
    this.addEventListener("sl-request-close", this.denyClose);
  }

  handleToggle(event) {
    const changes = { networkContext: {} };
    changes.networkContext[event.target.name] = event.target.checked;
    store.updateState(changes);
  }

  handleInput(event) {
    const changes = { networkContext: {} };
    changes.networkContext[event.target.name] = event.target.value;
    store.updateState(changes);
  }

  render() {
    const { networkContext, appContext } = this.context.store;
    return html`
      <sl-dialog ?open=${this.isOpen} class="dialog-deny-close" no-header>
        <form @submit=${this.handleSubmit}>

          <div class="form-control">
            <sl-switch
              name="useMocks"
              help-text="When enabled, ApiClient returns mocked successful responses"
              .checked=${networkContext.useMocks}
              @sl-change=${this.handleToggle}>
                Network Mocks
            </sl-switch>
          </div>

          <div class="form-control">
            <sl-switch
              name="forceFailures"
              help-text="When enabled, ApiClient returns failure responses"
              .checked=${networkContext.forceFailures}
              @sl-change=${this.handleToggle}>
                Force Network Failures
            </sl-switch>
          </div>

          <div class="form-control">
            <sl-switch
              name="reqLogs"
              help-text="When enabled, Requests and Responses are logged"
              .checked=${networkContext.reqLogs}
              @sl-change=${this.handleToggle}>
                Request/Response Logs
            </sl-switch>
          </div>

          <div class="form-control">
            <sl-input
              type="number"
              name="forceDelayInSeconds"
              help-text="Mocks will wait [x] seconds before responding"
              value=${networkContext.forceDelayInSeconds}
              @sl-change=${this.handleInput}>
                Force Network Delay
            </sl-switch>
          </div>
          <div class="form-control">
            <sl-switch
              name="overrideBaseUrl"
              help-text="Force API calls to use base URL below"
              .checked=${networkContext.overrideBaseUrl}
              @sl-change=${this.handleToggle}>
                Override Base URL
            </sl-input>
          </div>
          <div class="form-control">
            <sl-input
              type="text"
              name="apiBaseUrl"
              help-text="API calls will use this base URL"
              value=${networkContext.apiBaseUrl}
              @sl-change=${this.handleInput}>
                API Base URL
            </sl-input>
          </div>
          <div class="form-control">
            <sl-input
              type="text"
              name="demoSystemPrompt"
              help-text="Force Display of System Prompt"
              value=${networkContext.demoSystemPrompt}
              @sl-change=${this.handleInput}>
                Force Prompt by Name
            </sl-input>

          </div>
        </form>
        <div slot="footer">
          <sl-button @click=${this.closeDialog}>Close</sl-button>
        </div>
      </sl-dialog>
    `;
  }

  disconnectedCallback() {
    dialog = this.shadowRoot.querySelector(".dialog-deny-close");
    dialog.removeEventListener("sl-request-close", this.denyClose);
    super.disconnectedCallback();
  }

  denyClose = (event) => {
    if (event.detail.source === "overlay") {
      event.preventDefault();
    }
  };

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
    console.log("Settings saved!");
    this.closeDialog();
  }
}

customElements.define("debug-settings-dialog", DebugSettingsDialog);
