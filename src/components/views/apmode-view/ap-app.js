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
import "/components/views/apmode-view/view-ap-setup.js";

// Do this once to set the location of shoelace assets (icons etc..)
setBasePath("/vendor/@shoelace/cdn@2.14.0/");

class AppModeApp extends LitElement {
  static styles = [appModeStyles]
  static properties = {};

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html`
      <div id="App">
        <main id="Main">
          <view-ap-setup></view-ap-setup>
        </main>
      </div>
    `;
  }
}

customElements.define("apmode-app", AppModeApp);
