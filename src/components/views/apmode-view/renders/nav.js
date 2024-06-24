import { html } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export function renderNav() {
  return html`
    <div class="nav-inner">
      <div>
        <sl-dropdown distance="15">
          <sl-button slot="trigger" circle>
            <sl-icon name="three-dots"></sl-icon>
          </sl-button>
          <sl-menu>
            <sl-menu-item>Visit Forum</sl-menu-item>
            <sl-menu-item @click=${this.showResetPassDialog}>Reset Password</sl-menu-item>
            <sl-divider></sl-divider>
            <sl-menu-item>Factory Reset</sl-menu-item>
            <sl-divider></sl-divider>
            <sl-menu-item ?disabled=${!this.isLoggedIn} @click=${this.performLogout}>Logout</sl-menu-item>
          </sl-menu>
        </sl-dropdown>
      </div>
    </div>
  `
}