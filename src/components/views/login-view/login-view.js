import { LitElement, html, css } from "/vendor/@lit/all@3.1.2/lit-all.min.js";
import { asyncTimeout } from "/utils/timeout.js";
import { postLogin } from "/api/login/login.js";
import { getRouter } from "/router/router.js";

// Components
import "/components/common/dynamic-form/dynamic-form.js";

class LoginView extends LitElement {
  static styles = css`
    :host {
      display: flex;
      width: 100%;
      height: 100vh;
    }
    .page {
      max-width: 480px;
      display: flex;
      align-self: center;
      justify-content: center;
      margin: -10vh auto 0 auto;
    }
    .padded {
      padding: 20px;
    }
    h1 {
      font-family: "Comic Neue", sans-serif;
    }
    sl-alert {
      margin-bottom: 1em;
    }
  `;

  static get properties() {
    return {
      _server_fault: { type: Boolean },
      _invalid_creds: { type: Boolean },
      _loginFields: { type: Object },
      _attemptLogin: { type: Object },
    };
  }

  constructor() {
    super();
    this._server_fault = false;
    this._invalid_creds = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("sl-hide", this.dismissErrors);
    this._loginFields = {
      sections: [
        {
          name: "login",
          submitLabel: "Login",
          fields: [
            {
              name: "password",
              label: "Enter Password",
              type: "password",
              passwordToggle: true,
            },
          ],
        },
      ],
    };
  }

  disconnectedCallback() {
    this.removeEventListener("sl-hide", this.dismissErrors);
    super.disconnectedCallback();
  }

  dismissErrors() {
    this._invalid_creds = false;
    this._server_fault = false;
  }

  _attemptLogin = async (data, form, dynamicFormInstance) => {
    // Do a thing
    const loginResponse = await postLogin(data).catch(this.handleFault);

    if (!loginResponse) {
      dynamicFormInstance.retainChanges(); // stops spinner
      return;
    }

    // Credential error
    if (loginResponse.error) {
      dynamicFormInstance.retainChanges(); // stops spinner
      this.handleError(loginResponse.error);
      return;
    }

    if (!loginResponse.token) {
      dynamicFormInstance.retainChanges(); // stops spinner
      this.handleError("MISSING-TOKEN");
      return;
    }

    // Credential success
    if (loginResponse.token) {
      dynamicFormInstance.retainChanges(); // stops spinner
      this.handleSuccess();
      return;
    }
  };

  handleFault = (loginFault) => {
    this._server_fault = true;
    console.warn(loginFault);
    window.alert("boo. something went wrong");
  };

  handleError(loginResponseError) {
    switch (loginResponseError) {
      case "CHECK-CREDS":
        this._invalid_creds = true;
        break;
      case "MISSING-TOKEN":
        this.handleFault({ error: loginResponseError });
        break;
      default:
        this.handleFault({ unhandledError: loginResponseError });
    }
  }

  handleSuccess() {
    window.location = "/pups";
  }

  render() {
    return html`
      <div class="page">
        <div class="padded">
          <h1>Such Login</h1>
          <sl-alert variant="danger" ?open=${this._invalid_creds} closable>
            <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
            Incorrect password
          </sl-alert>

          <dynamic-form
            .fields=${this._loginFields}
            .onSubmit=${this._attemptLogin}
            requireCommit
          >
          </dynamic-form>
        </div>
      </div>
    `;
  }
}

customElements.define("login-view", LoginView);
