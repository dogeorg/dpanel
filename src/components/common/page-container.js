import { LitElement, html, css, nothing, classMap } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import { store } from "/state/store.js";

class PageContainer extends LitElement {

  static styles = css`
    @keyframes slideFadeIn {
      0% {
        opacity: 0.5;
        transform: translateY(15px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideFadeOut {
      0% {
        opacity: 0.5;
        transform: translateY(0);
      }
      100% {
        opacity: 0;
        transform: translateY(-15px);
      }
    }

    :host {
      display: block;
      position: relative;
    }

    :host(.exiting) {
      animation: slideFadeOut 200ms ease forwards;
    }

    :host(.entering) {
      animation: slideFadeIn 200ms ease forwards;
    }

    :host(.entering) .page-header,
    :host(.exiting) .page-header {}

    :host(.entering) .page-body,
    :host(.exiting) .page-body {
      margin-top: 0px;
      position: relative;
      top: 80px;
    }

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
      display: block;
      width: 100%;
      overflow: hidden;
      position: relative;
      margin-top: 80px;
    }
  `;

  static properties = {
    pageTitle: { type: String },
    pageAction: { type: String },
    previousPath: { type: String },
    upwardPath: { type: String },
    transitioning: { type: Boolean },
    router: { type: Object }
  }

  constructor() {
    super();
    this.pageTitle = "";
    this.pageAction = "";
    this.previousPath = "";
    this.upwardPath = "";
    this.transitioning = false;
    this.router = null;
  }

  async handleBackClick(e) {
    try {
      // Navigate up the page stack.
      const pathStack = store.appContext.pathStack;

      if (pathStack.length > 1) {
        pathStack.pop(); // Remove the current path
        const previousPath = pathStack[pathStack.length - 1]; // Get the new last path

        await store.updateState({
          appContext: {
            pathStack: pathStack
          }
        });
        return this.router.go(previousPath);
      }

      // If no page stack, navigate up the path
      const destination = this.upwardPath || "/";
      this.router.go(destination);
    } catch (err) {
      // All else fails, navigate to "/".
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
    // const pageBodyClasses = classMap({ pushed: true })

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

      <div class="page-body">
        <slot></slot>
      </div>
      `
  }
}

customElements.define('page-container', PageContainer);
