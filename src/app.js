import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

// Add shoelace once. Use components anywhere.
import { setBasePath } from '/vendor/@shoelace/cdn@2.14.0/utilities/base-path.js';
import '/vendor/@shoelace/cdn@2.14.0/shoelace.js';

// App state (singleton)
import { store } from '/state/store.js';

// Data fetching
import { getManifests } from '/api/manifest/index.js';

// Views
import '/components/views/index.js';

// Components
import '/utils/debug-panel.js'; 

// Router (singleton)
import { getRouter } from '/router/router.js'
import { loadPupContext } from '/router/middleware.js'

// Do this once to set the location of shoelace assets (icons etc..)
setBasePath('/vendor/@shoelace/cdn@2.14.0/');

class DPanelApp extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    this.fetchManifestData();
  }

  firstUpdated() {
    // Initialise our router singleton and provide it a target elemenet.
    const router = getRouter(this.shadowRoot.querySelector('#Outlet'));

    // Set out routes
    router.setRoutes([
      { path: '/', component: 'home-view' },
      { path: '/pups', component: 'pups-view' },
      { path: '/stats', component: 'stats-view' },
      { path: '/config', component: 'config-view' },
      { path: '/config', component: 'config-view' },
      { path: '/form', component: 'form-view' },
      { path: '/pup/:path*', action: loadPupContext, component: 'iframe-view' },
    ]);

    // For demonstration
    const alertExample = this.shadowRoot.querySelector('#AlertExample');
    setTimeout(() => {
      //  alertExample && alertExample.show();
    }, 3000);
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
    }
    @font-face {
      font-family: 'Comic Neue';
      src: url('../../vendor/@gfont/Comic_Neue/ComicNeue-Regular.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
    }
    .pushed-right {
      margin-left: 250px;
    }
    #Side {
      position: absolute;
      z-index: 1;
      width:250px;
      height: 100%;
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
    return html`
      <div id="Side">
        <sl-drawer 
          class="app-drawer"
          label="Dogebox dPanel"
          placement="start"
          style="--size: 270px;"
          contained
          no-header
          open
          >
          <sl-menu-label>Dogebox</sl-menu-label>
          <sl-menu-item value="home">
            <sl-icon slot="prefix" name="house-heart"></sl-icon>
            <a href="/">Such Home</a>
          </sl-menu-item>
          <sl-menu-item value="apps">
            <sl-icon slot="prefix" name="box-seam"></sl-icon>
            <a href="/pups">Much Pups</a>
            <sl-badge slot="suffix" variant="warning" pill>3</sl-badge>
          </sl-menu-item>
          <sl-menu-item value="stats">
            <sl-icon slot="prefix" name="heart-pulse"></sl-icon>
            <a href="/stats">Very Stats</a>
          </sl-menu-item>
          <sl-menu-item value="config">
            <sl-icon slot="prefix" name="sliders"></sl-icon>
            <a href="/config">So Config</a>
          </sl-menu-item>
          
          <sl-divider></sl-divider>
          
          <sl-menu-label>Recent</sl-menu-label>
          
          ${this.renderList()}
          
        </sl-drawer>
      </div>

      <main class="pushed-right">
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

      <!-- Debugger Widget -->
      <debug-panel></debug-panel>
    `;
  }
}

customElements.define('dpanel-app', DPanelApp);
