import { LitElement, html, css } from "/vendor/@lit/all@3.1.2/lit-all.min.js";
import "/components/common/action-row/action-row.js";

export class InterfaceList extends LitElement {
  static get properties() {
    return {
      _ready: { type: Boolean },
      interfaces: { type: Array }
    }
  }

  constructor() {
    super();
    this._ready = true;
    this.interfaces = [
      {
        "name": "pingpong",
        "version": "0.0.1",
        "permissionGroups": [
          {
            "name": "pingme",
            "description": "Pingme permission allows access to call the ping API",
            "severity": 3,
            "routes": [
              "/ping"
            ]
          }
        ]
      }
    ];
  }

  render() {
    return html`
      ${this.interfaces.map(iface => html`
        <action-row
          style="--height: 80px"
          label="${iface.name}"
          prefix="layers"
          .trigger=${() => this.toggleDetails(iface.name)}
        >
          <span>Version: ${iface.version}</span>
          <span slot="more">${iface.permissionGroups.length} permission(s)</span>
        </action-row>
        
        <!-- sl-details class="interface-details" id="details-${iface.name}">
          ${iface.permissionGroups.length > 0 ? html`
            <div class="details-group">
              ${iface.permissionGroups.map(group => html`
                <action-row
                  label="${group.name}"
                  prefix="shield"
                  variant="${this.getSeverityVariant(group.severity)}"
                >
                  ${group.description}
                  <span slot="more">Severity: ${group.severity}</span>
                  <span slot="suffix">${group.routes.length} route(s)</span>
                </action-row>
              `)}
            </div>
          ` : html`<p>No permission groups available.</p>`}
        </sl-details -->
      `)}
    `;
  }

  toggleDetails(interfaceName) {
    const details = this.shadowRoot.querySelector(`#details-${interfaceName}`);
    details.toggle();
  }

  getSeverityVariant(severity) {
    switch(severity) {
      case 1: return 'primary';
      case 2: return 'warning';
      case 3: return 'danger';
      default: return 'default';
    }
  }

  static styles = css`
    .interface-details {
      margin-left: 48px;
      margin-bottom: 10px;
    }
  `
}

customElements.define("x-action-interface-list", InterfaceList);