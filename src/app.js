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
  transitionStyles,
} from "/components/views/app-view/styles/index.styles.js";

// App state (singleton)
import { store } from "/state/store.js";
import { StoreSubscriber } from "/state/subscribe.js";

// Views
import "/components/views/index.js";
import "/components/common/page-container.js";
import "/components/views/welcome-dialog/index.js";
import "/components/views/system-prompt/index.js";

// Components
import "/utils/debug-panel.js";

// Render chunks
import * as renderMethods from "/components/views/app-view/renders/index.js";

// Router (singleton)
import { Router } from "/router/router.js";
import { routes } from "/router/config.js";

// Utils
import debounce from "/utils/debounce.js";
import { bindToClass } from "/utils/class-bind.js";

// Do this once to set the location of shoelace assets (icons etc..)
setBasePath("/vendor/@shoelace/cdn@2.14.0/");

// Main web socket channel (singleton)
import { mainChannel } from "/controllers/sockets/main-channel.js";

class DPanelApp extends LitElement {
  static properties = {
    menuAnimating: { type: Boolean },
    systemPromptActive: { type: Boolean },
    currentPath: { type: String },
  };

  static styles = [
    mainStyles,
    navStyles,
    utilStyles,
    transitionStyles
  ];

  constructor() {
    super();
    this.context = new StoreSubscriber(this, store);
    this.menuAnimating = false;
    this.systemPromptActive = false;
    this.currentPath = "";
    this._debouncedHandleResize = debounce(this._handleResize.bind(this), 50);
    this.mainChannel = mainChannel;
    this.router = null;
    this.outletWrapper = null;
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

    // Menu animating event handler
    this.addEventListener("menu-toggle-request", this._handleMenuToggleRequest);
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this._debouncedHandleResize);
    this.removeEventListener("menu-toggle-request", this._handleMenuToggleRequest);
    this.mainChannel.removeObserver(this);
    super.disconnectedCallback();
  }

  firstUpdated() {
    // Initialise our router singleton and provide it a target elemenet.
    const outlet = this.shadowRoot.querySelector("#Outlet");
    // this.outletWrapper = this.shadowRoot.querySelector("#OutletWrapper")
    this.router = new Router(outlet);
    this.router.setRoutes(routes)
  }

  _handleResize() {
    // Determine the orientation based on the window width
    const orientation = window.innerWidth > 920 ? "landscape" : "portrait";
    // Update the appContext.orientation state
    store.updateState({ appContext: { orientation } });
  }

  _handleMenuToggleRequest() {
    this.menuAnimating = true;

    setTimeout(() => {
      this.menuAnimating = false;
    }, 2000)
  }

  openDrawer() {
    const drawer = this.shadowRoot.querySelector("sl-drawer");
    drawer.show();
  }

  handleNavClick(e) {
    // const anchor = e.currentTarget.querySelector('a');
    // if (anchor) { anchor.click(); }
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

  selectActionIcon(action) {
    const actions = {
      back: "chevron-left",
      close: "x-lg"
    }
    return actions[action] || ""
  }

  render() {
    const { pageTitle, pageAction } = this.context.store.appContext;
    const { previousPathname, upwardPathname } = this.context.store.appContext
    const CURPATH = this.context.store.appContext.pathname || "";
    const showSystemPrompt = this.context.store.promptContext.display;
    const taskName = this.context.store.promptContext.name;
    const showChrome = !CURPATH.startsWith("/login");
    const mainClasses = classMap({
      backward: this.context.store.appContext.navigationDirection === "backward",
      opaque: showSystemPrompt,
    });

    return html`
      ${showChrome ? this.renderNav(CURPATH) : nothing}
      <main id="Main" class=${mainClasses}>
        <div id="Outlet"></div>
      </main>
      ${showChrome ? this.renderFooter() : nothing}

      <aside>
        <welcome-dialog></welcome-dialog>
        <debug-panel></debug-panel>
        <system-prompt ?open=${showSystemPrompt} task=${taskName}></system-prompt>
      </aside>
    `;
  }
}

customElements.define("dpanel-app", DPanelApp);
