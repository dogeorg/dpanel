import { LitElement, html, css, nothing } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import { getRouter } from "/router/router.js";

class PageContainer extends LitElement {

  static styles = css`
  .page-header {
    height: 80px;
    background: #181818;
    border-left: 1px solid #333333;

    display: flex;
    align-items: center;
    gap: 1em;
    flex-direction: row;

    padding: 0em 1em;

    h2 {
      font-family: 'Comic Neue';
    }
  }

  .page-body {
    height: 100%;
    width: 100%;
    overflow: hidden;
    border-left: 1px solid #333333;
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
      const destination = this.previousPath || this.upwardPath || "/"
      this.router.go(destination);
    } catch (err) {
      console.warn('Routing warning:', err)
      window.location = "/";
    }
  }

  render() {
    const { pageTitle, pageAction, handleBackClick } = this;
    return html`
      ${pageTitle ? html `
        <div class="page-header">
          ${pageAction ? html`
            <sl-button @click=${handleBackClick} variant="default" size="large" circle>
              <sl-icon name="chevron-left" label="Back"></sl-icon>
            </sl-button>
          `: nothing }
          <h2>${pageTitle}</h2>
        </div>
      `: nothing }

      <div class="page-body">
        <slot></slot>
      </div>
      `
  }
}

customElements.define('page-container', PageContainer);
