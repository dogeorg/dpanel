import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

class ApLoginView extends LitElement {

  static get properties() {
    return {
      onForgotPass: { type: Object }
    }
  }

  constructor() {
    super();
    this.onForgotPass = () => console.log('Not defined');
    this.loginFields = {
      sections: [
        {
          submitLabel: 'Log in',
          fields: [
            {
              "type": "text",
              "name": "managementPassword",
              "placeholder": "Enter your password",
              "required": true
            }
          ]
        }
      ]
    }
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
      max-width: 380px;
      display: flex;
      justify-content: center;
      flex-direction: column;
    }
    h1 {
      font-family: 'Comic Neue', sans-serif;
      text-align: center;
    }
  `

  render() {
    return html`
      <div class="padded">
        <login-view></login-view>
        <sl-button variant="text" @click="${this.handleForgotPass}">I forgot my password</sl-button>
      </div>
    `;
  }
}

customElements.define('view-ap-login', ApLoginView);