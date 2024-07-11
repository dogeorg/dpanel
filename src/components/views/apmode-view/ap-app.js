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
import { appModeStyles } from "/components/views/apmode-view/styles.js";
import { navStyles } from "./renders/nav.js";

// Views
import "/components/views/apmode-view/view-ap-login.js";
import "/components/views/login-view/login-view.js";
import "/components/views/change-pass-view/change-pass-view.js";
import "/components/views/create-key/create-key.js";
import "/components/views/select-network-view/select-network-view.js";
import "/components/views/setup-complete-view/setup-complete-view.js";

// Components
import "/components/common/dynamic-form/dynamic-form.js";

// Render chunks
import * as renderChunks from "./renders/index.js";

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
    this.dialog = null;
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
    this.dialog = this.shadowRoot.querySelector("#ChangePassDialog");
    this.dialog.addEventListener("sl-request-close", (event) => {
      if (event.detail.source === "overlay") {
        event.preventDefault();
      }
    });

    // Prevent dialog closures on overlay click
    this.dialogMgmt = this.shadowRoot.querySelector("#MgmtDialog");
    this.dialogMgmt.addEventListener("sl-request-close", (event) => {
      if (event.detail.source === "overlay") {
        event.preventDefault();
      }
    });
    this.dialogMgmt.addEventListener("sl-after-hide", (event) => {
      if (event.originalTarget.id === "MgmtDialog") {
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

  showResetPassDialog() {
    this.dialog.show();
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
                ${guard([this.activeStepNumber], () => this.renderNav())}
              </nav>

              <main id="Main">
                <div class="main-step-wrapper">
                  ${choose(
                    this.activeStepNumber,
                    [
                      [
                        0,
                        () =>
                          html`<view-ap-login
                            .onForgotPass=${() => this.showResetPassDialog()}
                            retainHash
                          ></view-ap-login>`,
                      ],
                      [
                        1,
                        () =>
                          html`<change-pass-view
                            label="Secure your Dogebox"
                            buttonLabel="Continue"
                            description="Set your admin password.  This is also used in generating your Dogebox master key."
                            resetMethod="token"
                            retainHash
                            .onSuccess=${this._nextStep}
                          ></change-pass-view>`,
                      ],
                      [
                        2,
                        () =>
                          html`<create-key
                            .onSuccess=${this._nextStep}
                          ></create-key>`,
                      ],
                      [
                        3,
                        () =>
                          html`<select-network-view
                            .onSuccess=${async () => { await asyncTimeout(750); this._nextStep() }}
                          ></select-network-view>`,
                      ],
                      [
                        4,
                        () => html`<setup-complete-view></setup-complete-view>`,
                      ],
                    ],
                    () => html`<h1>Error</h1>`,
                  )}
                </div>
              </main>
            </div>
          `
        : nothing}

      <sl-dialog id="ChangePassDialog">
        <change-pass-view
          resetMethod="credentials"
          .fieldDefaults=${{ resetMethod: this.isLoggedIn ? 0 : 1 }}
        ></change-pass-view>
      </sl-dialog>

      ${guard([this.context.store.setupContext.view], () => html`
        <sl-dialog id="MgmtDialog" no-header ?open=${this.context.store.setupContext.view !== null }>
          ${choose(store.setupContext.view, [
            ['network', () => html`
              <select-network-view
                showSuccessAlert
                .onClose=${() => this._closeMgmtDialog()}>
              </select-network-view>
            `],
            ['password', () => html`
              <div class="coming-soon">
                <h3>Not yet implemented</h3>
              </div>`],
            ['factory-reset', () => html`
              <div class="coming-soon">
                <h3>Not yet implemented</h3>
              </div>`],
          ])}
          <sl-button slot="footer" outline @click=${this._closeMgmtDialog}>Close</sl-button>
        </sl-dialog>
      `)}
    `;
  }
}

customElements.define("apmode-app", AppModeApp);
