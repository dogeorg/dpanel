import { LitElement, html, css, nothing } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export class ConfirmationPrompt extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      description: { type: String },
      leftButtonText: { type: String },
      leftButtonVariant: { type: String },
      leftButtonClick: { type: Function },
      rightButtonText: { type: String },
      rightButtonVariant: { type: String },
      rightButtonClick: { type: Function },
    }
  }

  constructor() {
    super();

    this.title = this.title ?? 'Are you sure?'
    this.leftButtonVariant = this.leftButtonVariant ?? 'text'
    this.rightButtonVariant = this.rightButtonVariant ?? 'danger'

    this._rightButtonClick = () => {
      if (this.rightButtonClick) this.rightButtonClick()
    }

    this._leftButtonClick = () => {
      if (this.leftButtonClick) this.leftButtonClick()
    }
  }

  render() {
    return html`
      <div style="text-align: center;">
        <h3>${this.title}</h3>
        <p>${this.description}</p>
      </div>
      <div slot="footer" style="display: flex; justify-content: space-between;">
        <sl-button variant="${this.leftButtonVariant}" @click=${this._leftButtonClick}>${this.leftButtonText}</sl-button>
        <sl-button variant="${this.rightButtonVariant}" @click=${this._rightButtonClick}>${this.rightButtonText}</sl-button>
      </div>
    `;
  }
}

customElements.define("x-confirmation-prompt", ConfirmationPrompt);