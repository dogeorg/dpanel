import { LitElement, html, css } from "/vendor/@lit/all@3.1.2/lit-all.min.js";
import { themes } from "/components/common/dynamic-form/themes.js";
import "/components/views/launcher-button/index.js";

class SetupCompleteView extends LitElement {
  static styles = [
    themes,
    css`
      :host {
        font-family: "Comic Neue";
        text-align: center;
      }
      p {
        font-size: 1.2rem;
      }
      img.hero {
        width: 300px;
      }
      .actions {
        display: flex;
        flex-direction: column;
        max-width: 380px;
        margin: 0 auto 2em auto;
      }
      .actions.gapped {
        gap: 0.55em;
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
    `,
  ];
  render() {
    return html`
      <div class="upper">
        <img class="hero" src="/static/img/celebrate.png" />
        <div class="actions">
          <p>
            <b>Congratulations!</b> You have configured your Dogebox with a
            password, key and connection.
          </p>
          <dogebox-launcher-button></dogebox-launcher-button>
          <p>
            Need help? Visit
            <a href="https://setup.dogebox.net">setup.dogebox.net</a>
          </p>
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
        <div class="actions gapped">
          <sl-button variant="neutral" outline>Change Network</sl-button>
          <sl-button variant="neutral" outline>Change Password</sl-button>
          <sl-button variant="neutral" outline>Factory Reset</sl-button>
        </div>
      </div>
    `;
  }
}

customElements.define("setup-complete-view", SetupCompleteView);
