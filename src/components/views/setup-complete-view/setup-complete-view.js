import { LitElement, html, css } from "/vendor/@lit/all@3.1.2/lit-all.min.js";
import { themes } from "/components/common/dynamic-form/themes.js";
import "/components/views/launcher-button/index.js";
import { store } from "/state/store.js";
import { notYet } from "/components/common/not-yet-implemented.js"

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
        margin-bottom: 2em;
      }
      .lower h2 {
        line-height: 1rem;
      }

      .pictoral-instruction {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: .5em;
        justify-content: center;
        border: 1px dashed var(--sl-panel-border-color);
        gap: 0.5em;

        & sl-icon.usb {
          font-size: 2rem;
          position: relative;
          top: -1px;
          transform: rotateZ(90deg);
        }
      }
    `,
  ];

  handleMgmtOptionClick(e) {
    store.updateState({ setupContext: { view: e.currentTarget.getAttribute('data-id') }});
  }

  render() {
    return html`
      <div class="upper">
        <img class="hero" src="/static/img/celebrate.png" />
        <div class="actions">

          <div class="pictoral-instruction" style="display: none;">
            <sl-icon class="usb" name="usb-drive-fill"></sl-icon>
            <span>Please remove the startup USB</span>
          </div>

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
          <sl-button variant="neutral" outline data-id="network"
            @click=${this.handleMgmtOptionClick}>Change Network
          </sl-button>

          <sl-button variant="neutral" outline data-id="password"
            @click=${this.handleMgmtOptionClick}>Change Password
          </sl-button>

          <sl-button variant="neutral" outline data-id="factory-reset"
            @click=${notYet}>Factory Reset
          </sl-button>
        </div>

        <div class="pictoral-instruction" style="display:none;">
          <sl-icon class="usb" name="usb-drive-fill"></sl-icon>
          <span>Insert the startup USB to perform these actions</span>
        </div>
      </div>
    `;
  }
}

customElements.define("setup-complete-view", SetupCompleteView);
