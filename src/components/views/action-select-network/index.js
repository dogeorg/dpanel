import { LitElement, html, css } from "/vendor/@lit/all@3.1.2/lit-all.min.js";
import { getNetworks } from "/api/network/get-networks.js";
import { postNetwork } from "/api/network/set-network.js";
import { asyncTimeout } from "/utils/timeout.js";
import { createAlert } from "/components/common/alert.js";

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
      margin: 0em 0em;
    }
    h1 {
      font-family: "Comic Neue", sans-serif;
    }
  `;

  static get properties() {
    return {
      showSuccessAlert: { type: Boolean },
      _server_fault: { type: Boolean },
      _invalid_creds: { type: Boolean },
      _setNetworkFields: { type: Object },
      _setNetworkValues: { type: Object },
      _attemptSetNetwork: { type: Object },
    };
  }

  constructor() {
    super();
    this._form = null;
    this._server_fault = false;
    this._invalid_creds = false;
    this._setNetworkFields = {};
    this._setNetworkValues = {};
    this._networks = [];

    // Set initial fields
    this.updateSetNetworkFields();
  }

  async connectedCallback() {
    super.connectedCallback();
    this.addEventListener(
      "action-label-triggered",
      this.handleLabelActionClick,
    );
    this.addEventListener("sl-hide", this.dismissErrors);
  }

  firstUpdated() {
    this._form = this.shadowRoot.querySelector("dynamic-form");
    this._fetchAvailableNetworks();
  }

  updateSetNetworkFields() {
    this._setNetworkFields = {
      sections: [
        {
          name: "select-network",
          submitLabel: "Much Connect",
          fields: [
            {
              name: "device-name",
              label: "Set device name",
              labelAction: { name: "generate-name", label: "Randomize" },
              type: "text",
              required: true,
              breakline: true,
            },
            {
              name: "network",
              label: "Select Network",
              labelAction: { name: "refresh", label: "Refresh" },
              type: "select",
              required: true,
              options: [
                ...this._networks,
                { type: "wifi", value: "hidden", label: "Hidden Network" },
              ],
            },
            {
              name: "network-ssid",
              label: "Network SSID",
              type: "text",
              required: true,
              // revealOn: ["network", "=", "hidden"],
              revealOn: (state, values) => state.network && state.network.value == "hidden"
            },
            {
              name: "network-pass",
              label: "Network Password",
              type: "password",
              required: true,
              passwordToggle: true,
              // revealOn: ["network", "!=", "ethernet"],
              revealOn: (state, values) => Boolean(
                (state.network && state.network.encryption === "PSK") ||
                (state.network && state.network.type !== "ethernet")
              )
            },
          ],
        },
      ],
    };
  }

  async _fetchAvailableNetworks() {
    // Start label spinner
    this._form.toggleLabelLoader("network");

    const response = await getNetworks();
    if (!response.networks) return [];

    const { networks } = response;
    this._networks = networks;

    // Networks have been retrieved, ensure they are supplied
    // as the network picker's options.
    this.updateSetNetworkFields();

    // If the retrieved networks has an identifed SELECTED network,
    // set it as the chosen option.
    const selectedNetwork = networks.find((net) => net.selected);
    if (selectedNetwork) {
      this._setNetworkValues = {
        ...this._setNetworkValues,
        network: selectedNetwork.value
      }
    }

    // Stop label spinner
    this._form.toggleLabelLoader("network");
  }

  disconnectedCallback() {
    this.removeEventListener("sl-hide", this.dismissErrors);
    this.removeEventListener(
      "action-label-triggered",
      this.handleLabelActionClick,
    );
    super.disconnectedCallback();
  }

  dismissErrors() {
    this._invalid_creds = false;
    this._server_fault = false;
  }

  async handleLabelActionClick(event) {
    event.stopPropagation();
    switch (event.detail.actionName) {
      case "generate-name":
        this._form.toggleLabelLoader(event.detail.fieldName);
        await asyncTimeout(300);
        this._generateName();
        this._form.toggleLabelLoader(event.detail.fieldName);
        break;
      case "refresh":
        await this._fetchAvailableNetworks();
        break;
      default:
        console.warn("Unhandled form action received", event.detail);
    }
  }

  _generateName() {
    const rando = Math.round(Math.random() * 1000);
    this._form.setValue("device-name", `my_dogebox_${rando}`);
  }

  _attemptSetNetwork = async (data, form, dynamicFormInstance) => {

    console.log({
      changesOnly: data,
      currentState: dynamicFormInstance.getState(),
      currentValues: dynamicFormInstance.getFormValues()
    });

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
      dynamicFormInstance.toggleCelebrate();
      await this.handleSuccess();
      return;
    }
  };

  handleFault = (fault) => {
    this._server_fault = true;
    console.warn(fault);
    window.alert("boo. something went wrong");
  };

  handleError(err) {
    const message = [
      "Connection failed",
      "Please check your network details (SSID, Password) and try again.",
    ];
    const action = {
      text: "View details",
    };
    createAlert("danger", message, "emoji-frown", null, action, new Error(err));
  }

  async handleSuccess() {
    if (this.showSuccessAlert) {
      createAlert("success", "Network configuration saved.", "check-square", 4000);
    }
    if (this.onSuccess) {
      await this.onSuccess();
    }
  }

  render() {
    return html`
      <div class="page">
        <div class="padded">
          ${renderBanner()}
          ${this._setNetworkFields ? html`
            <dynamic-form
              .fields=${this._setNetworkFields}
              .values=${this._setNetworkValues}
              .onSubmit=${this._attemptSetNetwork}
              requireCommit
              theme="yellow"
              style="--submit-btn-width: 100%; --submit-btn-anchor: center;"
            >
            </dynamic-form>
            `: nothing }
        </div>
      </div>
    `;
  }
}

customElements.define("x-action-select-network", SelectNetwork);
