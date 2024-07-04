import { LitElement, html, css } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

class SetupCompleteView extends LitElement {
  static styles = css`
    :host {
      font-family: "Comic Neue";
      text-align: center;
    }
    .actions {
      display: flex;
      flex-direction: column;
      gap: 0.45em;
      max-width: 380px;
      margin: 0 auto 2em auto;
    }
    .actions sl-button::part(base) {
      width: 100%;
    }
    .lower {
      padding: 0.2em 0;
    }
    .lower h2 {
      line-height: 1rem;
    }
  `;
  render() {
    return html`
      <div class="upper">
        <h1>Setup Complete!</h1>
        <div class="actions">
          <sl-button variant="primary">Launch Dogebox App</sl-button>
        </div>
      </div>

      <div class="center">
        <sl-divider></sl-divider>
      </div>

      <div class="lower">
        <h2>Recovery Actions</h2>
        <p>
          Insert your recovery USB at any time to perform the following
          administrative actions
        </p>
        <div class="actions">
          <sl-button variant="neutral" outline>Change Network</sl-button>
          <sl-button variant="neutral" outline>Change Password</sl-button>
          <sl-button variant="neutral" outline>Factory Reset</sl-button>
        </div>
      </div>
    `;
  }
}

customElements.define("setup-complete-view", SetupCompleteView);
