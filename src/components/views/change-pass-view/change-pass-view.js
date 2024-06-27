import { LitElement, html, css } from "/vendor/@lit/all@3.1.2/lit-all.min.js";
import { postChangePass } from "/api/password/change-pass.js";
import { createAlert } from "/components/common/alert.js";

// Components
import "/components/common/dynamic-form/dynamic-form.js";

// Render chunks
import { renderBanner } from "./renders/banner.js";

// Store
import { store } from "/state/store.js";

class ChangePassView extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    .page {
      display: flex;
      align-self: center;
      justify-content: center;
      padding-bottom: 1em;
    }
    .padded {
      width: 100%;
      margin: 0em 0em;
    }
    h1 {
      font-family: "Comic Neue", sans-serif;
    }
  `;

  static get properties() {
    return {
      default_to: { type: String },
      label: { type: String },
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
    this.onsuccess = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("sl-hide", this.dismissErrors);
    this._changePassFields = {
      sections: [
        {
          name: "Change password",
          submitLabel: "Update Password",
          fields: [
            {
              name: "reset-method",
              type: "toggleField",
              defaultTo: this.default_to || 0,
              labels: ["Alternatively, enter seed-phrase (12 words)", "Alternatively, enter current password"],
              fields: [
                {
                  name: "password",
                  label: "Enter Current Password",
                  type: "password",
                  passwordToggle: true,
                  required: true,
                },
                {
                  name: "seedphrase",
                  label: "Enter Seed Phrase (12-words)",
                  type: "seedphrase",
                  placeholder: "hungry tavern drumkit weekend dignified turmoil cucumber pants karate yacht treacle chump",
                  required: true,
                },
              ],
            },
            {
              name: "new_password",
              label: "Enter New Password",
              type: "password",
              passwordToggle: true,
              requireConfirmation: true,
              required: true,
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

  _attemptChangePass = async (data, form, dynamicFormInstance) => {
    // Do a thing
    console.log(data);

    const response = await postChangePass(data).catch(this.handleFault);

    if (!response) {
      dynamicFormInstance.retainChanges(); // stops spinner
      return;
    }

    // Handle error
    if (response.error) {
      dynamicFormInstance.retainChanges(); // stops spinner
      this.handleError(response.error);
      return;
    }

    // Handle success
    if (!response.error) {
      dynamicFormInstance.retainChanges(); // stops spinner
      this.handleSuccess();
      return;
    }
  };

  handleFault = (fault) => {
    this._server_fault = true;
    console.warn(fault);
    window.alert("boo. something went wrong");
  };

  handleError(err) {
    switch (err) {
      case "CHECK-CREDS":
        this._invalid_creds = true;
        break;
      default:
        this.handleFault({ unhandledError: err });
    }
  }

  handleSuccess = () => {
    createAlert('success', 'Password updated.', 'check-square', 2000);
    
    if (this.onSuccess) {
      this.onSuccess();
    }

    if (!this.onSuccess) {
      store.updateState({ networkContext: { token: null }});
      window.location = "/";
    }
  }

  render() {
    return html`
      <div class="page">
        <div class="padded">
          ${renderBanner(this.label)}
          <dynamic-form
            .fields=${this._changePassFields}
            .onSubmit=${this._attemptChangePass}
            requireCommit
            theme="purple"
          >
          </dynamic-form>
        </div>
      </div>
    `;
  }
}

customElements.define("change-pass-view", ChangePassView);
