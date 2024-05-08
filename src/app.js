import {
  LitElement,
  html,
  nothing,
} from "/vendor/@lit/all@3.1.2/lit-all.min.js";

// Add shoelace once. Use components anywhere.
import { setBasePath } from "/vendor/@shoelace/cdn@2.14.0/utilities/base-path.js";
import "/vendor/@shoelace/cdn@2.14.0/shoelace.js";

// Import stylesheets
import { mainStyles, navStyles, utilStyles } from "/styles/app.index.styles.js";

// App state (singleton)
import { store } from "/state/store.js";
import { StoreSubscriber } from "/state/subscribe.js";

// Views
import "/components/views/index.js";
import "/components/views/welcome-dialog/index.js";

// Components
import "/utils/debug-panel.js";

// Router (singleton)
import { getRouter } from "/router/router.js";

// Utils
import debounce from "/utils/debounce.js";

// Do this once to set the location of shoelace assets (icons etc..)
setBasePath("/vendor/@shoelace/cdn@2.14.0/");

// Main web socket channel (singleton)
import { mainChannel } from "/controllers/sockets/main-channel.js";

class DPanelApp extends LitElement {
  static properties = {
    menuVisible: { type: Boolean },
    currentPath: { type: String },
  };

  constructor() {
    super();
    this.context = new StoreSubscriber(this, store);
    this.menuVisible = false;
    this.currentPath = "";
    this._debouncedHandleResize = debounce(this._handleResize.bind(this), 50);
    this.mainChannel = mainChannel;
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
    getRouter(this.shadowRoot.querySelector("#Outlet"));
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

  render() {
    const CURPATH = this.context.store.appContext.pathname || "";
    const hideNav = !CURPATH.startsWith("/login");

    return html`
      <div id="App">
        ${hideNav
          ? html`
          <nav id="Nav">
            <div id="GutterNav" ?open=${this.menuVisible}>
              <div id="logo" class="gutter-menu-item" @click=${() => window.location.reload(true)}>
                <img src="/static/img/dogebox-logo-small.png" />
              </div>
              <div id="menu" class="gutter-menu-item" @click=${this.handleMenuClick}>
                <sl-icon name="grid-fill"></sl-icon>
              </div>
            </div>

            <div id="Side" ?open=${this.menuVisible}>
              <div class"nav-body">
                <div class="menu-label">dpanel v0.0.2</div>
                <div class="menu-item ${CURPATH === "/" ? "active" : ""}">
                  <sl-icon name="house-heart-fill"></sl-icon>
                  <a href="/">Such Home</a>
                </div>

                <div class="menu-item ${CURPATH.startsWith("/pups") ? "active" : ""}">
                  <sl-icon name="box-seam"></sl-icon>
                  <a href="/pups">Much Pups</a>
                </div>

                <div class="menu-item ${CURPATH.startsWith("/stats") ? "active" : ""}">
                  <sl-icon name="heart-pulse-fill"></sl-icon>
                  <a href="/stats">Very Stats</a>
                </div>

                <div class="menu-item ${CURPATH.startsWith("/config") ? "active" : ""}">
                  <sl-icon name="sliders"></sl-icon>
                  <a href="/config">So Config</a>
                </div>
              </div>

              <div class="nav-footer">
                <sl-divider></sl-divider>
                <div class="nav-footer-content">
                  <p>Propel the people's currency using your Dogebox.</p>
                  <sl-button outline>Read Docs</sl-button>
                </div>
              </div>
            </div>
          </nav>
        `
          : nothing}
        <main id="Main">
          <div id="Outlet"></div>
        </main>
      </div>

      <aside>
        <welcome-dialog></welcome-dialog>
        <debug-panel></debug-panel>
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
