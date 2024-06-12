import { LitElement, html } from "/vendor/@lit/all@3.1.2/lit-all.min.js";
import { promptStyles } from "./styles.js";
import { store } from "/state/store.js";

class SystemPrompt extends LitElement {
  static styles = [promptStyles];
  static properties = {
    open: { type: Boolean, reflect: true },
    closing: { type: Boolean, reflect: true },
  };

  connectedCallback() {
    super.connectedCallback();
  }

  close() {
    // Animate host (fade)
    this.style.animation = "fadeOut 0.3s ease-out forwards";
    this.style.animationDelay = "300ms";
    // Animate panel (slide)
    const innerEl = this.shadowRoot.querySelector(".inner");
    innerEl.style.animation = "slideOut 0.5s ease-out forwards";

    setTimeout(() => {
      // Reset host animations;
      this.style.animation = "fadeIn 0.3s ease-out forwards";
      this.style.animationDelay = "0";
      // Reset panel animations;
      innerEl.style.animation = "slideIn 350ms ease-out forwards";

      // Update central store
      store.updateState({
        promptContext: {
          display: false,
          type: null,
        },
      });
    }, 500);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html`
      <div class="outer">
        <div class="inner">
          <div class="heading-container">
            <img src="/static/img/prompt_b.png" />
            <div class="more-container">
              <hr />
              <a href="#"
                >Why am I seeing this?
                <sl-icon name="info-circle-fill"></sl-icon
              ></a>
            </div>
          </div>
          <div class="content-container">
            <div class="message-container">
              <h3 class="title">
                <b>Tipjar</b> is requesting you to sign the following
                transaction:
              </h3>

              <div class="review-container">
                <div class="review-element">
                  <div class="label-wrap">
                    <label>Amount</label>
                    <span class="copy"
                      >copy <sl-icon name="copy"></sl-icon
                    ></span>
                  </div>
                  <span class="val">Ð69,000</span>
                </div>

                <div class="review-element">
                  <div class="label-wrap">
                    <label>From</label>
                    <span class="copy"
                      >copy <sl-icon name="copy"></sl-icon
                    ></span>
                  </div>
                  <span class="val">DH5yaieqoZN36fDVciNyRueRGvGLR3mr7L</span>
                </div>

                <div class="review-element">
                  <div class="label-wrap">
                    <label>To</label>
                    <span class="copy"
                      >copy <sl-icon name="copy"></sl-icon
                    ></span>
                  </div>
                  <span class="val">DH5yaieqoZN36fDVciNyRueRGvGLR3mr7L</span>
                </div>
              </div>

              <div class="button-container" @click=${this.close}>
                <sl-button variant="warning" size="large">Reject</sl-button>
                <span>OR</span>
                <sl-button variant="warning" size="large" @click=${this.close}
                  >Approve</sl-button
                >
              </div>

              <div class="more-container mobile">
                <hr />
                <a href="#"
                  >Why am I seeing this?
                  <sl-icon name="info-circle-fill"></sl-icon
                ></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("system-prompt", SystemPrompt);

