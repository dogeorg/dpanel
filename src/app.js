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
  mainStyles,
  navStyles,
  utilStyles,
} from "/components/views/app-view/styles/index.styles.js";

// App state (singleton)
import { store } from "/state/store.js";
import { StoreSubscriber } from "/state/subscribe.js";

// Views
import "/components/views/index.js";
import "/components/views/welcome-dialog/index.js";
import "/components/views/system-prompt/index.js";

// Components
import "/utils/debug-panel.js";

// Render chunks
import * as renderMethods from "/components/views/app-view/renders/index.js";

// Router (singleton)
import { getRouter } from "/router/router.js";

// Utils
import debounce from "/utils/debounce.js";
import { bindToClass } from "/utils/class-bind.js";

// Do this once to set the location of shoelace assets (icons etc..)
setBasePath("/vendor/@shoelace/cdn@2.14.0/");

// Main web socket channel (singleton)
import { mainChannel } from "/controllers/sockets/main-channel.js";

class DPanelApp extends LitElement {
  static properties = {
    menuVisible: { type: Boolean },
    systemPromptActive: { type: Boolean },
    currentPath: { type: String },
  };

  constructor() {
    super();
    this.context = new StoreSubscriber(this, store);
    this.menuVisible = true;
    this.systemPromptActive = false;
    this.currentPath = "";
    this._debouncedHandleResize = debounce(this._handleResize.bind(this), 50);
    this.mainChannel = mainChannel;
    this.router = null;
    bindToClass(renderMethods, this);
  }

  connectedCallback() {
    super.connectedCallback();

    // Add the resize event listener
    window.addEventListener("resize", this._debouncedHandleResize);
    // Initial check to set orientation on load
    this._handleResize();

    // Instanciate a web socket connection and add app as an observer
    this.mainChannel.addObserver(this);
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this._debouncedHandleResize);
    this.mainChannel.removeObserver(this);
    super.disconnectedCallback();
  }

  firstUpdated() {
    // Initialise our router singleton and provide it a target elemenet.
    this.router = getRouter(this.shadowRoot.querySelector("#Outlet")).Router;
  }

  _handleResize() {
    // Determine the orientation based on the window width
    const orientation = window.innerWidth > 920 ? "landscape" : "portrait";
    // Update the appContext.orientation state
    store.updateState({ appContext: { orientation } });
  }

  openDrawer() {
    const drawer = this.shadowRoot.querySelector("sl-drawer");
    drawer.show();
  }

  handleMenuClick() {
    this.menuVisible = !this.menuVisible;
  }

  handleNavClick(e) {
    const anchor = e.currentTarget.querySelector('a');
    if (anchor) { anchor.click(); }
  }

  handleBackClick(e) {
    try {
      // TODO. This needs to travel back up the route stack better.
      this.router.go(this.context.store.appContext.previousPathname)
    } catch (err) {
      console.warn('Routing warning:', err)
      history.back();
    }
  }

  enableSystemPrompt() {
    if (this.systemPromptActive) {
      this.shadowRoot.querySelector("system-prompt").close();
      setTimeout(() => {
        this.systemPromptActive = false;
      }, 400);
    } else {
      this.systemPromptActive = !this.systemPromptActive;
    }
  }

  render() {
    const { pageTitle, pageAction } = this.context.store.appContext;
    const CURPATH = this.context.store.appContext.pathname || "";
    const showSystemPrompt = this.context.store.promptContext.display;
    const taskName = this.context.store.promptContext.name;
    const showChrome = !CURPATH.startsWith("/login");
    const mainClasses = classMap({
      opaque: showSystemPrompt,
    });

    return html`
      <div id="App">
        ${showChrome ? this.renderNav(CURPATH) : nothing}
        <main id="Main" class=${mainClasses}>

          ${pageTitle ? html `
            <div id="OutletHeader">
              ${pageAction ? html`
                <sl-button @click=${this.handleBackClick} variant="default" size="large" circle>
                  <sl-icon name="chevron-left" label="Back"></sl-icon>
                </sl-button>
              `: nothing }
              <h2>${pageTitle}</h2>
            </div>
          `: nothing }

          <div id="Outlet"></div>

        </main>
        ${showChrome ? this.renderFooter() : nothing}
      </div>

      <aside>
        <welcome-dialog></welcome-dialog>
        <debug-panel></debug-panel>
        <system-prompt ?open=${showSystemPrompt} task=${taskName}></system-prompt>
      </aside>

      <style>
        ${mainStyles}
        ${navStyles}
        ${utilStyles}
      </style>
    `;
  }
}

customElements.define("dpanel-app", DPanelApp);
