import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

// Add shoelace once. Use components anywhere.
import { setBasePath } from '/vendor/@shoelace/cdn@2.14.0/utilities/base-path.js';
import '/vendor/@shoelace/cdn@2.14.0/shoelace.js';

// App state (singleton)
import { store } from '/state/store.js';
import { StoreSubscriber } from '/state/subscribe.js';

// Data fetching
import { getManifests } from '/api/manifest/index.js';

// Views
import '/components/views/index.js';
import '/components/views/welcome-dialog/index.js';

// Components
import '/utils/debug-panel.js'; 

// Router (singleton)
import { getRouter } from '/router/router.js'
import { wrapActions, loadPupContext } from '/router/middleware.js'

// Utils
import debounce from '/utils/debounce.js';

// Do this once to set the location of shoelace assets (icons etc..)
setBasePath('/vendor/@shoelace/cdn@2.14.0/');

class DPanelApp extends LitElement {

  static properties = {
    menuVisible: { type: Boolean },
    currentPath: { type: String },
  }

  constructor() {
    super();
    this.context = new StoreSubscriber(this, store);
    this.menuVisible = true;
    this.currentPath = '';
    this._debouncedHandleResize = debounce(this._handleResize.bind(this), 50);
  }

  connectedCallback() {
    super.connectedCallback();

    // Fetch main manifest (for pup listing)
    // this.fetchManifestData();

    // Add the resize event listener
    window.addEventListener('resize', this._debouncedHandleResize);
    // Initial check to set orientation on load
    this._handleResize();
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this._debouncedHandleResize);
    super.disconnectedCallback();
  }

  firstUpdated() {
    // Initialise our router singleton and provide it a target elemenet.
    const router = getRouter(this.shadowRoot.querySelector('#Outlet'));

    // Set out routes
    router.setRoutes([
      { path: '/',           action: wrapActions(),               component: 'home-view' },
      { path: '/pups',       action: wrapActions(),               component: 'manage-view' },
      { path: '/stats',      action: wrapActions(),               component: 'stats-view' },
      { path: '/config',     action: wrapActions(),               component: 'config-view' },
      { path: '/config',     action: wrapActions(),               component: 'config-view' },
      { path: '/form',       action: wrapActions(),               component: 'form-view' },
      { path: '/manage',     action: wrapActions(),               component: 'manage-view' },
      { path: '/pup/:path*', action: wrapActions(loadPupContext), component: 'iframe-view' },
    ]);

    // For demonstration
    const alertExample = this.shadowRoot.querySelector('#AlertExample');
    setTimeout(() => {
      //  alertExample && alertExample.show();
    }, 3000);
  }

  _handleResize() {
    // Determine the orientation based on the window width
    const orientation = window.innerWidth > 920 ? 'landscape' : 'portrait';
    // Update the appContext.orientation state
    store.updateState({ appContext: { orientation }});
  }

  async fetchManifestData() {
    try {
      const manifestData = await getManifests();
      this.manifest = manifestData;
      this.requestUpdate();
    } catch (error) {
      console.error('Error fetching manifest:', error);
    }
  }

  openDrawer() {
    const drawer = this.shadowRoot.querySelector('sl-drawer');
    drawer.show();
  }

  static styles = css`
    :host {
      display: block;
      height: 100vh;
      overflow: hidden;
      box-sizing: border-box;
    }
    @font-face {
      font-family: 'Comic Neue';
      src: url('../../vendor/@gfont/Comic_Neue/ComicNeue-Regular.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
    }

    #Main {
      background: #0000008f;
      /*background: #121215;*/
      margin-left: 60px;
    }

    #Main[pushed] {
      margin-left: 300px;
    }

    #GutterNav {
      position: absolute;
      z-index: 2;
      width:60px;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1em;
      padding: 0.75em 0.2em;
      background: #1c1b22;
    }

    #GutterNav[open] {
      background: #282731;
      border-right: 1px solid var(--sl-panel-border-color);
    }

    #GutterNav #logo {
      background: rgb(255, 208, 67);
      border: 1px solid rgb(255, 208, 67);
    }

    #GutterNav .gnav-menu-item {
      background: grey;
      width: 30px;
      height: 30px;
      border: 1px solid grey;
    }

    #GutterNav .gnav-menu-item:hover {
      background: lightgrey;
      border: 1px solid lightgrey;
      cursor: pointer;
    }

    #Side[open] {
      background: #1a191f;
      display: flex;
    }

    #Side {
      display: none;
      position: absolute;
      left: 67px;
      z-index: 1;
      width: 240px;
      flex-direction: column;
      justify-content: space-between;
      box-sizing: border-box;
      gap: 1em;
      height: 100%;
      background: #1a191f;
    }

    #Side .menu-item {
      padding: 0.5em 1em;
      margin: 0.2em 0em 0.2em 0.5em;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 1em;
      font-family: 'Comic Neue';
      font-weight: 600;
      font-size: 1.1rem;
    }

    #Side .menu-item:hover {
      background: rgba(255,255,255,0.1);
    }

    #Side .menu-label {
      padding: 0.5em 1.5em;
      font-size: 0.85rem;
      text-transform: uppercase;
      color: #5e74eb;
      font-weight: bold;
      font-family: 'Comic Neue';
    }

    #Side .menu-item.active {
      background: #4360ff;
    }

    #Side .menu-item.active a,
    #Side .menu-item.active sl-icon {
      text-decoration: none;
      color: white;
    }

    #Side .menu-item a {
      color: rgba(255,255,255,0.5);
    }

    #Side .menu-item sl-icon {
      font-size: 1.3rem;
      color: rgba(255,255,255,0.5);
    }

    .pad-sides {
      padding: 0em var(--sl-spacing-x-large);
    }

    .pad-top {
      padding-top: var(--sl-spacing-x-large);
    }

    .pad-bottom {
      padding-bottom: var(--sl-spacing-x-large);
    }

    #Outlet {
      overflow: hidden;
    }
    #Alerts {
      position: fixed;
      z-index: 500; /* mid zheight */
      top: 0;
      right: 0;
      width: 500px;
      box-sizing: border-box;
      margin-top: 10px;
      margin-right: 25px;
    }
  `

  handleMenuClick() {
    this.menuVisible = !this.menuVisible;
  }

  renderList() {
    if (!this.manifest) return;
    return html`
      ${Object.entries(this.manifest).map(([key, value]) => html`
        <sl-menu-item>
          <sl-icon slot="prefix" name="${value.icon}"></sl-icon>
          <a href="${value.path}">${value.name}</a>
        </sl-menu-item>
      `)}
    `;
  }

  render() {

    const CURPATH = this.context.store.appContext.pathname

    return html`
      <div id="GutterNav" ?open=${this.menuVisible}>
        <div id="logo" class="gnav-menu-item"></div>
        <div id="menu" class="gnav-menu-item" @click=${this.handleMenuClick}></div>
      </div>

      <div id="Side" ?open=${this.menuVisible}>
        <nav>
          <div>
            <div class="menu-label">dpanel v0.0.2</div>
            <div class="menu-item ${CURPATH === '/' ? 'active' : ''}">
              <sl-icon name="house-heart-fill"></sl-icon>
              <a href="/">Such Home</a>
            </div>

            <div class="menu-item ${CURPATH.startsWith('/pups') ? 'active' : ''}">
              <sl-icon name="box-seam"></sl-icon>
              <a href="/pups">Much Pups</a>
            </div>

            <div class="menu-item ${CURPATH.startsWith('/stats') ? 'active' : ''}">
              <sl-icon name="heart-pulse-fill"></sl-icon>
              <a href="/stats">Very Stats</a>
            </div>

            <div class="menu-item ${CURPATH.startsWith('/config') ? 'active' : ''}">
              <sl-icon name="sliders"></sl-icon>
              <a href="/config">So Config</a>
            </div>
          </div>
        </nav>

        <div class="nav-footer">
          <sl-divider></sl-divider>
          <div class="pad-sides pad-bottom">
            <p>Velit duis ullamco ad anim nostrud cillum pariatur minim excepteur irure.</p>
            <sl-button outline>Get Started</sl-button>
          </div>
        </div>
      </div>

      <main id="Main" ?pushed=${this.menuVisible}>
        <div id="Alerts">
          <sl-alert id="AlertExample" closable>
            <sl-icon slot="icon" name="gear"></sl-icon>
            <strong>Your settings have been updated</strong><br />
            Services are being restarted.
          </sl-alert>
        </div>
        <div id="Outlet">
          <!-- Views injected here as users navigate -->
        </div>
      </main>

      <welcome-dialog></welcome-dialog>

      <!-- Debugger Widget -->
      <debug-panel></debug-panel>
    `;
  }
}

customElements.define('dpanel-app', DPanelApp);
