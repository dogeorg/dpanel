import { LitElement, html, css } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

class ApLoginView extends LitElement {
  static get properties() {
    return {
      onForgotPass: { type: Object },
      retainHash: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.onForgotPass = () => console.log("Not defined");
    this.retainHash = false;
    this.loginFields = {
      sections: [
        {
          submitLabel: "Log in",
          fields: [
            {
              type: "text",
              name: "managementPassword",
              placeholder: "Enter your password",
              required: true,
            },
          ],
        },
      ],
    };
  }

  handleForgotPass() {
    this.onForgotPass();
  }

  static styles = css`
    :host {
      display: flex;
      justify-content: center;
      flex-direction: column;
    }
    .padded {
      padding: 20px;
      width: 100%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
    }
    h1 {
      font-family: "Comic Neue", sans-serif;
      text-align: center;
    }
  `;

  render() {
    return html`
      <div class="padded">
        <login-view ?retainHash=${this.retainHash}></login-view>
        <sl-button variant="text" @click="${this.handleForgotPass}"
          >I forgot my password</sl-button
        >
      </div>
    `;
  }
}

customElements.define("view-ap-login", ApLoginView);

