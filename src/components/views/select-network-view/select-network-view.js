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
      default_to: { type: String },
      _server_fault: { type: Boolean },
      _invalid_creds: { type: Boolean },
      _setNetworkFields: { type: Object },
      _setNetworkValues: { type: Object },
      _attemptSetNetwork: { type: Object },
    };
  }

  constructor() {
    super();
    this._server_fault = false;
    this._invalid_creds = false;
    this._setNetworkFields = {};
    this._setNetworkValues = { 'device-name': 'potato', network: 'hidden', 'network-ssid': 'BarryWifi', 'network-pass': 'Peanut' };
    this._form = null;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.addEventListener('action-label-triggered', this.handleLabelActionClick);

    const networks = [];

    this._setNetworkFields = {
      sections: [
        {
          name: "Select Network",
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

  firstUpdated() {
    this._form = this.shadowRoot.querySelector('dynamic-form');
    this._fetchAvailableNetworks();
  }

  async _fetchAvailableNetworks() {
    // Start label spinner
    this._form.toggleLabelLoader('network');

    const response = await getNetworks()
    if (!response.networks) return [];

    const { networks } = response;

    this._setNetworkFields.sections[0].fields[1].options = [
      ...networks,
      { type: "wifi", value: "hidden", label: "Hidden Network" }
    ]
    // Stop label spinner
    this._form.toggleLabelLoader('network');
  }

  disconnectedCallback() {
    this.removeEventListener("sl-hide", this.dismissErrors);
    this.removeEventListener('action-label-triggered', this.handleLabelActionClick);
    super.disconnectedCallback();
  }

  dismissErrors() {
    this._invalid_creds = false;
    this._server_fault = false;
  }

  async handleLabelActionClick(event) {
    event.stopPropagation();
    switch(event.detail.actionName) {
      case 'generate-name':
        this._form.toggleLabelLoader(event.detail.fieldName);
        await asyncTimeout(300);
        this._generateName();
        this._form.toggleLabelLoader(event.detail.fieldName);
        break;
      case 'refresh':
        await this._fetchAvailableNetworks();
        break;
      default:
        console.warn('Unhandled form action received', event.detail)
    }
  }

  _generateName() {
    const rando = Math.round(Math.random() * 100)
    this._form.setValue('device-name', `Potato_${rando}`);
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
    const message = [
      'Connection failed',
      'Please check your network details (SSID, Password) and try again.'
    ];
    const action = {
      text: 'View details'
    };
    createAlert('danger', message, 'emoji-frown', null, action, new Error(err));
  }

  handleSuccess() {
    createAlert('success', 'Network set.', 'check-square', 2000);
    if (this.onSuccess) {
      this.onSuccess();
    }
  }

  render() {
    return html`
      <div class="page">
        <div class="padded">
          ${renderBanner()}
          <dynamic-form
            .fields=${this._setNetworkFields}
            .values=${this._setNetworkValues}
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
