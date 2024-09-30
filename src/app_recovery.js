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
import "/components/views/setup-dislaimer/index.js";
import "/components/views/confirmation-prompt/index.js";

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
import { getSetupBootstrap } from "/api/system/get-bootstrap.js";
import { postHostReboot } from "/api/system/post-host-reboot.js";
import { postHostShutdown } from "/api/system/post-host-shutdown.js";

// Do this once to set the location of shoelace assets (icons etc..)
setBasePath("/vendor/@shoelace/cdn@2.14.0/");

const STEP_LOGIN = 0;
const STEP_INTRO = 1;
const STEP_SET_PASSWORD = 2;
const STEP_GENERATE_KEY = 3;
const STEP_NETWORK = 4;
const STEP_DONE = 5;

class AppModeApp extends LitElement {
  static styles = [appModeStyles, navStyles];
  static properties = {
    loading: { type: Boolean },
    isLoggedIn: { type: Boolean },
    activeStepNumber: { type: Number },
    setupState: { type: Object },
    isFirstTimeSetup: { type: Boolean },
  };

  constructor() {
    super();
    this.dialogMgmt = null;
    this.isLoggedIn = false;
    this.activeStepNumber = 0;
    this.setupState = null;
    this.isFirstTimeSetup = false;

    bindToClass(renderChunks, this);
    this.context = new StoreSubscriber(this, store);

    this.reflectorToken = Math.random().toString(36).substring(2, 14);
    // this.reflectorHost = 'https://reflector.dogebox.org'
    this.reflectorHost = "http://127.0.0.1:9999"
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

    if (!response.setupFacts) {
      // TODO (error handling)
      alert('Failed to fetch bootstrap.');
      return;
    }

    this.setupState = response.setupFacts;
    this.loading = false;
  }

  _determineStartingStep(setupState) {
    const { hasCompletedInitialConfiguration, hasGeneratedKey, hasConfiguredNetwork } = setupState;

    if (!hasCompletedInitialConfiguration) {
      this.isFirstTimeSetup = true;
    }

    // If we're already fully set up, or if we've generated a key, show our login step.
    if ((hasCompletedInitialConfiguration || hasGeneratedKey) && !this.isLoggedIn) {
      return STEP_LOGIN;
    }

    if (!hasGeneratedKey) {
      return STEP_INTRO;
    }

    if (hasGeneratedKey && !hasConfiguredNetwork) {
      return STEP_NETWORK;
    }

    return STEP_DONE;
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
        store.updateState({ setupContext: { view: null, hideViewClose: false }});
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

  triggerReboot = async () => {
    await postHostReboot()
    this._closeMgmtDialog()
  }

  triggerPoweroff = async () => {
    await postHostShutdown()
    this._closeMgmtDialog()
  }

  _closeMgmtDialog = () => {
    store.updateState({ setupContext: { view: null, hideViewClose: false }});
  }

  render() {
    const navClasses = classMap({
      solid: true,
    });

    const stepWrapperClasses = classMap({
      "main-step-wrapper": this.activeStepNumber !== STEP_INTRO,
      "main-step-wrapper-disclaimer": this.activeStepNumber === STEP_INTRO,
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
                ${guard([this.isFirstTimeSetup, this.activeStepNumber, this.context.store.networkContext.token], () => this.renderNav(this.isFirstTimeSetup))}
              </nav>

              <main id="Main" style="padding-top: ${this.isFirstTimeSetup ? '0px;' : '100px'}">
                <div class="${stepWrapperClasses}">
                  ${choose(
                    this.activeStepNumber,
                    [
                      [
                        STEP_LOGIN,
                        () =>
                          html`<x-action-login retainHash></x-action-login>`,
                      ],
                      [
                        STEP_INTRO,
                        () =>
                          html`<x-setup-dislaimer
                            .nextStep=${this._nextStep}
                          ></x-setup-dislaimer>`,
                      ],
                      [
                        STEP_SET_PASSWORD,
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
                        STEP_GENERATE_KEY,
                        () =>
                          html`<x-action-create-key
                            .onSuccess=${this._nextStep}
                          ></x-action-create-key>`,
                      ],
                      [
                        STEP_NETWORK,
                        () =>
                          html`<x-action-select-network
                            .onSuccess=${async () => { await asyncTimeout(750); this._nextStep() }}
                            .reflectorHost=${this.reflectorHost}
                            .reflectorToken=${this.reflectorToken}
                          ></x-action-select-network>`,
                      ],
                      [
                        STEP_DONE,
                        () => html`<x-page-recovery
                          .reflectorHost=${this.reflectorHost}
                          .reflectorToken=${this.reflectorToken}
                          .isFirstTimeSetup=${this.isFirstTimeSetup}
                        ></x-page-recovery>`,
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
            ['reboot', () => html`
              <x-confirmation-prompt
                title="Are you sure you want to reboot?"
                description="Remove your USB recovery stick if you want to boot back into normal mode"
                leftButtonText="Cancel"
                .leftButtonClick=${this._closeMgmtDialog}
                rightButtonText="Reboot"
                .rightButtonClick=${this.triggerReboot}
              ></x-confirmation-prompt>
            `],
            ['power-off', () => html`
              <x-confirmation-prompt
                title="Are you sure you want to power off?"
                description="Physical access may be required to turn your Dogebox on again"
                leftButtonText="Cancel"
                .leftButtonClick=${this._closeMgmtDialog}
                rightButtonText="Yes, turn it off."
                .rightButtonClick=${this.triggerPoweroff}
              ></x-confirmation-prompt>
            `],
            ['factory-reset', () => html`
              <div class="coming-soon">
                <h3>Not yet implemented</h3>
              </div>`],
          ])}
          ${this.context.store.setupContext.hideViewClose ? nothing : html`
            <sl-button slot="footer" outline @click=${this._closeMgmtDialog}>Close</sl-button>
          `}
        </sl-dialog>
      `)}
      <x-debug-panel></x-debug-panel>
    `;
  }
}

customElements.define("apmode-app", AppModeApp);
