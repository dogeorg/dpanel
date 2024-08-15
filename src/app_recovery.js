import {
  LitElement,
  html,
  nothing,
  classMap,
  choose,
  guard
} from "/vendor/@lit/all@3.1.2/lit-all.min.js";

// Add shoelace once. Use components anywhere.
import { setBasePath } from "/vendor/@shoelace/cdn@2.14.0/utilities/base-path.js";
import "/vendor/@shoelace/cdn@2.14.0/shoelace.js";

// Import stylesheets
import { appModeStyles } from "/components/layouts/recovery/styles/index.js";
import { navStyles } from "/components/layouts/recovery/renders/nav.js";

// Views
import "/components/views/action-login/index.js";
import "/components/views/action-change-pass/index.js";
import "/components/views/action-create-key/index.js";
import "/components/views/action-select-network/index.js";
import "/pages/page-recovery/index.js";

// Components
import "/components/common/dynamic-form/dynamic-form.js";
import "/utils/debug-panel.js";

// Render chunks
import * as renderChunks from "/components/layouts/recovery/renders/index.js";

// Store
import { store } from "/state/store.js";
import { StoreSubscriber } from "/state/subscribe.js";

// Utils
import { bindToClass } from "/utils/class-bind.js";
import { asyncTimeout } from "/utils/timeout.js";

// APIS
import { getSetupBootstrap } from "/api/setup/get-bootstrap.js";

// Do this once to set the location of shoelace assets (icons etc..)
setBasePath("/vendor/@shoelace/cdn@2.14.0/");

class AppModeApp extends LitElement {
  static styles = [appModeStyles, navStyles];
  static properties = {
    loading: { type: Boolean },
    isLoggedIn: { type: Boolean },
    activeStepNumber: { type: Number },
    setupState: { type: Object },
  };

  constructor() {
    super();
    this.dialogMgmt = null;
    this.isLoggedIn = false;
    this.activeStepNumber = 0;
    this.setupState = null;
    bindToClass(renderChunks, this);
    this.context = new StoreSubscriber(this, store);
  }

  set setupState(newValue) {
    this._setupState = newValue;
    if (newValue) {
      const stepNumber = this._determineStartingStep(newValue);
      this.activeStepNumber = stepNumber;
    }
  }

  get setupState() {
    return this._setupState;
  }

  connectedCallback() {
    super.connectedCallback();
    this.isLoggedIn = !!store.networkContext.token;
  }

  async fetchSetupState() {
    this.loading = true;
    const response = await getSetupBootstrap();
    if (response.setup) {
      this.setupState = response.setup;
    }
    // TODO (error handling)
    this.loading = false;
  }

  _determineStartingStep(setupState) {
    const { hasPassword, hasKey, hasConnection } = setupState;
    if (hasPassword && !this.isLoggedIn) return 0;
    if (!hasPassword) return 1;
    if (hasPassword && this.isLoggedIn && !hasKey) return 2;
    if (hasPassword && this.isLoggedIn && hasKey && !hasConnection) return 3;
    return 4;
  }

  firstUpdated() {
    this.fetchSetupState();

    // Prevent dialog closures on overlay click
    this.dialogMgmt = this.shadowRoot.querySelector("#MgmtDialog");
    this.dialogMgmt.addEventListener("sl-request-close", (event) => {
      if (event.detail.source === "overlay") {
        event.preventDefault();
      }
    });
    this.dialogMgmt.addEventListener("sl-after-hide", (event) => {
      if (event.target.id === "MgmtDialog") {
        store.updateState({ setupContext: { view: null }});
      }
    });
  }

  _nextStep = () => {
    this.isLoggedIn = this.context.store.networkContext.token;
    this.activeStepNumber++;
  };

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  performLogout(e) {
    if (!e.currentTarget.disabled) {
      store.updateState({ networkContext: { token: null } });
      window.location.reload();
    }
  }

  _closeMgmtDialog = () => {
    store.updateState({ setupContext: { view: null }});
  }

  render() {
    const navClasses = classMap({
      solid: true,
    });
    return html`
      ${!this.setupState
        ? html`
            <div class="loader-overlay">
              <sl-spinner
                style="font-size: 2rem; --indicator-color: #bbb;"
              ></sl-spinner>
            </div>
          `
        : nothing}
      ${this.setupState
        ? html`
            <div id="App" class="chrome">
              <nav class="${navClasses}">
                ${guard([this.activeStepNumber, this.context.store.networkContext.token], () => this.renderNav())}
              </nav>

              <main id="Main">
                <div class="main-step-wrapper">
                  ${choose(
                    this.activeStepNumber,
                    [
                      [
                        0,
                        () =>
                          html`<x-action-login retainHash></x-action-login>`,
                      ],
                      [
                        1,
                        () =>
                          html`<x-action-change-pass
                            label="Secure your Dogebox"
                            buttonLabel="Continue"
                            description="Devise a secure password used to encrypt your Dogebox Master Key."
                            retainHash
                            noSubmit
                            .onSuccess=${this._nextStep}
                          ></x-action-change-pass>`,
                      ],
                      [
                        2,
                        () =>
                          html`<x-action-create-key
                            .onSuccess=${this._nextStep}
                          ></x-action-create-key>`,
                      ],
                      [
                        3,
                        () =>
                          html`<x-action-select-network
                            .onSuccess=${async () => { await asyncTimeout(750); this._nextStep() }}
                          ></x-action-select-network>`,
                      ],
                      [
                        4,
                        () => html`<x-page-recovery></x-page-recovery>`,
                      ],
                    ],
                    () => html`<h1>Error</h1>`,
                  )}
                </div>
              </main>
            </div>
          `
        : nothing}

      ${guard([this.context.store.setupContext.view], () => html`
        <sl-dialog id="MgmtDialog" no-header ?open=${this.context.store.setupContext.view !== null }>
          ${choose(store.setupContext.view, [
            ['network', () => html`
              <x-action-select-network
                showSuccessAlert
                .onClose=${() => this._closeMgmtDialog()}>
              </x-action-select-network>
            `],
            ['password', () => html`
              <x-action-change-pass
                resetMethod="credentials"
                showSuccessAlert
              ></x-action-change-pass>`],
            ['factory-reset', () => html`
              <div class="coming-soon">
                <h3>Not yet implemented</h3>
              </div>`],
          ])}
          <sl-button slot="footer" outline @click=${this._closeMgmtDialog}>Close</sl-button>
        </sl-dialog>
      `)}
      <x-debug-panel></x-debug-panel>
    `;
  }
}

customElements.define("apmode-app", AppModeApp);