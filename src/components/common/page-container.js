import { LitElement, html, css, nothing, classMap } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import { getRouter } from "/router/router.js";
import { store } from "/state/store.js";

class PageContainer extends LitElement {

  static styles = css`
  .page-header {
    position: fixed;
    top: 0px;
    z-index: 99;
    height: 80px;
    width: calc(100% - var(--page-margin-left));
    background: #181818;
    box-sizing: border-box;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5em;
    flex-direction: row;

    padding: 0em 1em;

    h2 {
      font-family: 'Comic Neue';
      text-transform: capitalize;
    }

    h2.alone {
      margin-left: 0.2em;
    }
  }

  .page-header section:first-child {
    flex: 1; /* To take up remaining space */

    display: flex;
    align-items: center;
    gap: 1em;
    flex-direction: row;
  }

  .page-header section:last-child {
    display: inline-block;
    text-align: right;
    width: 80px; /* Fixed width */

    @media (min-width: 576px) {
      display: none;
    }
  }


  .page-body {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  .pushed {
    margin-top: 80px;
  }
`;

  static properties = {
    pageTitle: { type: String },
    pageAction: { type: String },
    previousPath: { type: String },
    upwardPath: { type: String },
    router: { type: Object }
  }

  constructor() {
    super();
    this.pageTitle = "";
    this.pageAction = "";
    this.previousPath = "";
    this.upwardPath = "";
    this.router = null;
  }

  handleBackClick(e) {
    // Navigate to previous path (if known)
    // Else navigate back a segment of the href
    // All else fails, navigate to "/".
    try {
      console.log(this.previousPath, this.upwardPath, "/");
      const destination = this.upwardPath || this.previousPath || "/";
      this.router.go(destination);
    } catch (err) {
      console.warn('Routing warning:', err)
      window.location = "/";
    }
  }

  handleMenuClick(e) {
    store.updateState({ appContext: { menuVisible: !store.appContext.menuVisible }})
    this.dispatchEvent(new CustomEvent('menu-toggle-request', {
      detail: {},
      composed: true,
      bubbles: true
    }));
  }

  selectActionIcon(action) {
    const actions = {
      back: "chevron-left",
      close: "x-lg"
    }
    return actions[action] || ""
  }

  render() {
    const { pageTitle, pageAction, handleBackClick, handleMenuClick } = this;
    const pageBodyClasses = classMap({ pushed: !!pageTitle })

    const pageActionEl = !pageAction ? nothing : html`
      <sl-button @click=${handleBackClick} variant="default" size="large" circle>
        <sl-icon name=${this.selectActionIcon(pageAction)} label="Back"></sl-icon>
      </sl-button>
    `

    const menuIconEl = html`
      <sl-icon-button
        @click=${handleMenuClick}
        name="list"
        label="menu"
        style="font-size: 2rem;"
      ></sl-icon>
    `

    return html`
      <div class="page-header">
        <section>
          ${pageActionEl}
          <h2 class="${pageAction ? "" : "alone"}">${pageTitle}</h2>
        </section>
        <section>
          ${menuIconEl}
        </section>
      </div>

      <div class="page-body" class=${pageBodyClasses}>
        <slot></slot>
      </div>
      `
  }
}

customElements.define('page-container', PageContainer);
