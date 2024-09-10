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
} from "/components/layouts/standard/styles/index.styles.js";

// App state (singleton)
import { store } from "/state/store.js";
import { StoreSubscriber } from "/state/subscribe.js";

// Views
import "/pages/index.js";
import "/components/common/page-container.js";
import "/components/views/prompt-welcome/index.js";
import "/components/views/prompt-system/index.js";

// Components
import "/utils/debug-panel.js";

// Render chunks
import * as renderMethods from "/components/layouts/standard/renders/index.js";

// Router (singleton)
import { Router } from "/router/router.js";
import { routes } from "/router/config.js";

// Utils
import debounce from "/utils/debounce.js";
import { bindToClass } from "/utils/class-bind.js";
import { isUnauthedRoute, hasFlushParam } from "/utils/url-utils.js";

// Apis
import { getBootstrapV2 } from "/api/bootstrap/bootstrap.js";

// Do this once to set the location of shoelace assets (icons etc..)
setBasePath("/vendor/@shoelace/cdn@2.14.0/");

// Main web socket channel (singleton)
import { mainChannel } from "/controllers/sockets/main-channel.js";

// Pkg controller
import { pkgController } from "/controllers/package/index.js"

class DPanelApp extends LitElement {
  static properties = {
    ready: { type: Boolean },
    menuAnimating: { type: Boolean },
    systemPromptActive: { type: Boolean },
  };

  static styles = [
    mainStyles,
    navStyles,
    utilStyles,
    transitionStyles
  ];

  constructor() {
    super();
    this.ready = false;
    this.context = new StoreSubscriber(this, store);
    this.menuAnimating = false;
    this.systemPromptActive = false;
    this._debouncedHandleResize = debounce(this._handleResize.bind(this), 50);
    this.pkgController = pkgController;
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

  async firstUpdated() {
    // Fetch bootstrap if not on an unauthenticated route (ie, login/logout);
    if (!isUnauthedRoute() && !hasFlushParam()) {
      this.fetchBootstrap();
    }

    // Initialise our router singleton and provide it a target elemenet.
    const outlet = this.shadowRoot.querySelector("#Outlet");
    // this.outletWrapper = this.shadowRoot.querySelector("#OutletWrapper")
    this.router = new Router(outlet);
    this.router.setRoutes(routes)
    this.router.processCurrentRoute();

    // Hide menu on page change
    this.router.addHook(() => store.updateState({ appContext: { menuVisible: false }}))

    // Clear some contexts on route change
    this.router.addHook(() => store.clearContext(['pupContext', 'pupDefinitionContext']));

    if (isUnauthedRoute()) {
      setTimeout(() => { this.ready = true; }, 1500)
    }
  }

  async fetchBootstrap() {
    try {
      const res = await getBootstrapV2()
      if (res) { this.pkgController.setData(res); }
    } catch (err) {
      console.warn('Failed to fetch bootstrap')
    } finally {
      this.ready = true;
    }
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
    const CURPATH = window.location.pathname || "";
    const showSystemPrompt = this.context.store.promptContext.display;
    const taskName = this.context.store.promptContext.name;
    const showChrome = !CURPATH.startsWith("/login");
    const mainClasses = classMap({
      fullscreen: !showChrome,
      backward: this.context.store.appContext.navigationDirection === "backward",
      opaque: showSystemPrompt,
    });

    return html`
      <div class="loader-overlay" style="display:${!this.ready ? 'flex' : 'none'}"">
        <sl-spinner style="font-size: 2rem; --indicator-color: #bbb;"></sl-spinner>
      </div>

      ${showChrome ? this.renderNav(CURPATH) : nothing}
      <main id="Main" class=${mainClasses}>
        <div id="Outlet" style="display:${this.ready ? 'block' : 'none'}"></div>
      </main>
      ${showChrome ? this.renderFooter() : nothing}

      <aside>
        <welcome-dialog></welcome-dialog>
        <x-debug-panel></x-debug-panel>
        <system-prompt ?open=${showSystemPrompt} task=${taskName}></system-prompt>
      </aside>
    `;
  }
}

customElements.define("dpanel-app", DPanelApp);
