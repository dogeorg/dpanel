import {
  LitElement,
  html,
  nothing,
  classMap,
} from "/vendor/@lit/all@3.1.2/lit-all.min.js";

// Add shoelace once. Use components anywhere.
import { setBasePath } from "/vendor/@shoelace/cdn@2.14.0/utilities/base-path.js";
import "/vendor/@shoelace/cdn@2.14.0/shoelace.js";

// Import stylesheets
import {
  appModeStyles,
} from "/components/views/apmode-view/styles.js";

// Views
import "/components/views/apmode-view/view-ap-login.js";
import "/components/views/apmode-view/view-ap-setup.js";
import "/components/views/login-view/login-view.js";
import "/components/views/change-pass-view/change-pass-view.js";

// Components
import "/components/common/dynamic-form/dynamic-form.js";

// Render chunks
import * as renderChunks from "./renders/index.js"

// Store
import { store } from "/state/store.js";

// Utils
import { bindToClass } from "/utils/class-bind.js";

// Do this once to set the location of shoelace assets (icons etc..)
setBasePath("/vendor/@shoelace/cdn@2.14.0/");

class AppModeApp extends LitElement {
  static styles = [appModeStyles]
  static properties = {
    isLoggedIn: { type: Boolean }
  };

  constructor() {
    super();
    this.dialog = null;
    this.isLoggedIn = false;
    bindToClass(renderChunks, this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.isLoggedIn = store.networkContext.token;
  }

  firstUpdated() {
    // Prevent dialog closures on overlay click
    this.dialog = this.shadowRoot.querySelector('#ChangePassDialog');
    this.dialog.addEventListener('sl-request-close', event => {
      if (event.detail.source === 'overlay') {
        event.preventDefault();
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  performLogout() {
    store.updateState({ networkContext: { token: null }});
    window.location.reload()
  }

  showResetPassDialog() {
    this.dialog.show();
  }

  render() {
    return html`
      <div id="App" class="chrome">
        <nav>${this.renderNav()}</nav>
        <main id="Main">
          ${this.isLoggedIn ? html`
            <view-ap-setup></view-ap-setup>
          ` : html`
            <view-ap-login .onForgotPass=${() => this.showResetPassDialog()}></view-ap-login>
          `}
        </main>

        <sl-dialog id="ChangePassDialog">
          <change-pass-view default_to=${this.isLoggedIn ? 0 : 1}></change-pass-view>
        </sl-dialog>
      </div>
    `;
  }
}

customElements.define("apmode-app", AppModeApp);
