import {
  LitElement,
  html,
  css,
  nothing,
} from "/vendor/@lit/all@3.1.2/lit-all.min.js";
import "/components/common/action-row/action-row.js";

import { getProviders } from "/api/providers/providers.js";

class DependencyList extends LitElement {
  static get properties() {
    return {
      dependencies: { type: Array },
      providers: { type: Array },
      expandedDependency: { type: String },
      editMode: { type: Boolean },
      pupId: { type: String },
    };
  }

  constructor() {
    super();
    this.providers = [];
  }

  firstUpdated() {
    this.addEventListener("sl-hide", this.handleHide);
    if (this.editMode) {
      this.refreshProviders();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("sl-hide", this.handleHide);
  }

  handleHide(e) {
    e.stopPropagation();
  }

  handleExpand(dependencyName) {
    this.expandedDependency =
      this.expandedDependency === dependencyName ? "" : dependencyName;
  }

  handleProviderSelection(event, dependency) {
    const selectedProvider = event.detail.item.value;
    const providerInfo = this.providers.find(p => p.interface === dependency.interfaceName);
    if (providerInfo) {
      providerInfo.currentProvider = selectedProvider;
    }
    this.requestUpdate();
  }

  async refreshProviders() {
    try {
      const res = await getProviders(this.pupId);
      this.providers = res;
      this.requestUpdate();
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  }

  handleRefreshClick() {
    this.refreshProviders();
  }

  renderPermissionGroups(groups) {
    if (!groups || groups.length === 0) {
      return html`<p>No permission groups specified.</p>`;
    }
    return html`
      <div class="permission-group-list">
        ${groups.map((group) => html`<sl-tag size="small">${group}</sl-tag>`)}
      </div>`;
  }

  renderDependency(dependency) {
    const providerInfo = this.providers.find(p => p.interface === dependency.interfaceName);
    
    return html`
      <sl-card class="dependency" style="--width: 100%">
        <div class="permission-groups">
          <span class="label">Required Permissions</span>
          ${this.renderPermissionGroups(dependency.permissionGroups)}

          <sl-divider></sl-divider>

          ${this.editMode ? html`
            <div class="label-wrap">
              <span class="label">Select Provider</span>
              <sl-button variant="text" size="small" class="button-no-pad" @click=${this.handleRefreshClick}>Refresh</sl-button>
            </div>
            
            <sl-dropdown hoist @sl-select="${(e) => this.handleProviderSelection(e, dependency)}">
              <sl-button slot="trigger" class="provider-selector">
                <span id="selected-text-${dependency.interfaceName}">
                  ${providerInfo && providerInfo.currentProvider ? providerInfo.currentProvider : 'No Provider Selected'}
                </span>
                <sl-icon name="chevron-down"></sl-icon>
              </sl-button>
              <sl-menu>
                <sl-menu-label>Installed Pups</sl-menu-label>
                
                ${providerInfo && providerInfo.installedProviders.length ? 
                  providerInfo.installedProviders.map(provider => html`
                    <sl-menu-item value="${provider.pupName}">
                      ${provider.pupName}
                      <small>${provider.sourceLocation}</small>
                    </sl-menu-item>
                  `) : 
                  html`<sl-menu-item disabled>--</sl-menu-item>`
                }

                <sl-divider></sl-divider>
                
                <sl-menu-label>Available Pups (from your Sources)</sl-menu-label>

                ${providerInfo && providerInfo.InstallableProviders.length ? 
                  providerInfo.InstallableProviders.map(provider => html`
                    <sl-menu-item value="${provider.pupName}">
                      ${provider.pupName}
                      <small>${provider.sourceLocation}</small>
                    </sl-menu-item>
                  `) : 
                  html`<sl-menu-item disabled><small>-- Such empty --</small></sl-menu-item>`
                }
                
              </sl-menu>
            </sl-dropdown>

            <sl-button size="small" style="width: 115px; align-self: end; margin-top: 0.5em;" variant="primary">
              Save Selection
            </sl-button>

            <sl-divider></sl-divider>

            <span class="label" style="margin-bottom:0.25em;">Default Provider</span>
            ${this.renderDefaultProvider(providerInfo)}

            <sl-divider></sl-divider>

            <span class="label" style="margin-bottom:0.25em;">Other Providers</span>
            <sl-button variant="text" target="_blank" class="link-button-left">
              <sl-icon name="box-arrow-up-right" slot="suffix"></sl-icon>
              Browse the Pup Store for compatible Pups
            </sl-button>

          ` : html`
            <span class="label" style="margin-bottom:0.25em;">Default Provider</span>
            <small>
              <sl-tag slot="suffix">
                ${providerInfo && providerInfo.DefaultProvider ? 
                  `${providerInfo.DefaultProvider.pupName} (${providerInfo.DefaultProvider.sourceLocation})` : 
                  'No default provider'
                }
              </sl-tag>
            </small>              
            <sl-button variant="text" target="_blank" class="link-button-left">
              <sl-icon name="box-arrow-up-right" slot="suffix"></sl-icon>
              View in Pup Store
            </sl-button>

            <sl-divider></sl-divider>

            <span class="label" style="margin-bottom:0.25em;">Other Providers</span>
            <sl-button variant="text" target="_blank" class="link-button-left">
              <sl-icon name="box-arrow-up-right" slot="suffix"></sl-icon>
              Browse the Pup Store for compatible Pups
            </sl-button>
          `}
        </div>
      </sl-card>
    `;
  }

  renderDefaultProvider(providerInfo) {
    const defaultProvider = this.getDefaultProviderDisplay(providerInfo)

    if (!defaultProvider) return html`
      <small>No default provider.</small>
    `

    return html`
      <small>
        <sl-tag slot="suffix" size="small">
          ${defaultProvider}
        </sl-tag>
      </small>

      <sl-button variant="text" target="_blank" class="link-button-left">
        <sl-icon name="box-arrow-up-right" slot="suffix"></sl-icon>
        View in Pup Store
      </sl-button>
    `
  }

  getDefaultProviderDisplay(providerInfo) {
    if (!providerInfo || !providerInfo.DefaultProvider) {
      return false;
    }
    
    const { pupName, sourceLocation } = providerInfo.DefaultProvider;
    
    if (pupName && sourceLocation) {
      return `${pupName} (${sourceLocation})`;
    }
    
    return false;
  }

  render() {
    return html`
      <div>
        ${this.dependencies && this.dependencies.length === 0
          ? html`
              <div class="empty">
                Wow, such independence.<br />
                This pup has no dependencies. That's cool too.
              </div>
            `
          : nothing}
        ${this.dependencies.map(
          (dep) => html`
            <action-row
              label="${dep.interfaceName}"
              prefix="box"
              expandable
              ?expand=${true || this.expandedDependency === dep.interfaceName}
              @row-expand=${() => this.handleExpand(dep.interfaceName)}
            >
              <span>Version: ${dep.interfaceVersion}</span>
              <div
                class="dependency-details"
                slot="hidden"
                id="details-${dep.interfaceName}"
              >
                ${this.renderDependency(dep)}
              </div>
            </action-row>
          `,
        )}
      </div>
    `;
  }

  static styles = css`
    .dependency-details {
      margin-left: 48px;
    }

    .dependency {
      margin-bottom: 1em;
      width: 100%;

      .dependency-name,
      .version,
      .permission-groups,
      .source {
        display: flex;
        flex-direction: column;
      }

      .label-wrap {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }

      .label {
        text-transform: uppercase;
        font-size: 0.7rem;
        font-weight: bold;
      }

      .value {
        font-family: "Comic Neue";
      }
    }

    sl-button.button-no-pad::part(base),
    sl-button.button-no-pad::part(label) {
      padding: 0px;
      margin: 0px;
    }

    .empty {
      width: 100%;
      color: var(--sl-color-neutral-600);
      box-sizing: border-box;
      border: dashed 1px var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      padding: var(--sl-spacing-x-large) var(--sl-spacing-medium);
      font-family: "Comic Neue", sans-serif;
      text-align: center;
    }

    .provider-selector {
      width: 100%;
      &::part(label) {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
      }
    }

    sl-button.link-button-left::part(base) { justify-content: left; }
    sl-button.link-button-left::part(label) { padding-left:0px; }
  `;
}

customElements.define("x-action-manage-deps", DependencyList);