import { LitElement, html, css } from "/vendor/@lit/all@3.1.2/lit-all.min.js";
import { getNetworks } from "/api/network/get-networks.js";
import { postNetwork } from "/api/network/set-network.js";

// Components
import "/components/common/dynamic-form/dynamic-form.js";

// Render chunks
import { renderBanner } from "./renders/banner.js";

// Store
import { store } from "/state/store.js";

class SelectNetwork extends LitElement {
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
      margin: 0em 2em;
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
      default_to: { type: String },
      _server_fault: { type: Boolean },
      _invalid_creds: { type: Boolean },
      _setNetworkFields: { type: Object },
      _attemptSetNetwork: { type: Object },
    };
  }

  constructor() {
    super();
    this._server_fault = false;
    this._invalid_creds = false;
    this._setNetworkFields = {}
  }

  async connectedCallback() {
    super.connectedCallback();

    const networks = await this.fetchAvailableNetworks();

    this._setNetworkFields = {
      sections: [
        {
          name: "Select Network",
          submitLabel: "Much Connect",
          fields: [
            {
              name: "device-name",
              label: "Set device name",
              type: "text",
              required: true,
              breakline: true,
            },
            {
              name: "network",
              label: "Select Network",
              type: "select",
              required: true,
              options: [
                ...networks,
                { type: "wifi", value: "hidden", label: "Hidden Network" },
              ]
            },
            {
              name: "network-ssid",
              label: "Network SSID",
              type: "text",
              required: true,
              revealOn: ["network", "=", "hidden"]
            },
            {
              name: "network-pass",
              label: "Network Password",
              type: "password",
              required: true,
              passwordToggle: true,
              revealOn: ["network", "!=", "ethernet"]
            },
          ],
        },
      ],
    };

    this.addEventListener("sl-hide", this.dismissErrors);
  }

  async fetchAvailableNetworks() {
    const response = await getNetworks()
    if (response.networks) return response.networks;
    if (!response.networks) return [];
  }

  disconnectedCallback() {
    this.removeEventListener("sl-hide", this.dismissErrors);
    super.disconnectedCallback();
  }

  dismissErrors() {
    this._invalid_creds = false;
    this._server_fault = false;
  }

  _attemptSetNetwork = async (data, form, dynamicFormInstance) => {
    // Do a thing
    console.log(data);

    const response = await postNetwork(data).catch(this.handleFault);

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
      case "BAD-INPUT":
        break;
      default:
        this.handleFault({ unhandledError: err });
    }
  }

  handleSuccess() {
    window.alert('Network set. Nice one.');
  }

  render() {
    return html`
      <div class="page">
        <div class="padded">
          ${renderBanner()}
          <sl-alert variant="danger" ?open=${this._invalid_creds} closable>
            <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
            Incorrect password
          </sl-alert>

          <dynamic-form
            .fields=${this._setNetworkFields}
            .onSubmit=${this._attemptSetNetwork}
            requireCommit
            theme="yellow"
            style="--submit-btn-width: 100%; --submit-btn-anchor: center;"
          >
          </dynamic-form>
        </div>
      </div>
    `;
  }
}

customElements.define("select-network-view", SelectNetwork);
