import { LitElement, html, css } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

class SystemPrompt extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: absolute;
      top: 0;
      left: 0px;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 9999;
    }

    .outer {
      display: flex;
      position absolute;
      height: 100%;
      width: 100%;
      overflow: hidden;
      flex-direction: column;
      // background: rgb(67, 96, 255, 0.5);
      background: rgba(13, 32, 134, 0.6);

      @media (min-width: 576px) {
        align-items: center;
        justify-content: center;
      }
    }

    .inner {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: auto;
      background: #4360ff;
      gap: 1em;
      margin-top: 49px;
      padding-bottom: 2em;

      @media (min-width: 576px) {
        height: 70vh;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 0px;
      }

      animation-name: color;
      animation-duration: 700ms;
      animation-iteration-count: infinite;
      animation-direction: alternate-reverse;
      animation-timing-function: linear;
    }

    @keyframes color {
      from {
        background-color: rgb(44, 77, 255);
      }
      to {
        background-color: rgb(44, 77, 255);
        // background-color: rgb(85, 111, 255);
      }
    }

    .heading-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: -40px;
      margin-bottom: -25px;

      img {
        width: 100px;
      }

      h1 {
        display: none;
        font-size: 1rem;
        @media (min-width: 576px) {
          display: block;
        }
      }

      @media (min-width: 576px) {
        margin-top: 0px;
        img {
          width: 300px;
        }
      }

    }

    .content-container {
      height: calc(100vh - 119px);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      @media (min-width: 576px) {
        height: 100%;
      }
    }

    .message-container {
      padding: 0em 1em;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      h3 {
        line-height: 1.5;
      }

      @media (min-width: 576px) {
        flex-grow: 1;
        padding-right: 4em;
      }

    }

    .review-container {
      background: rgba(0,0,0,0.2);
      width: 90vw;
      overflow-y: hidden;
      margin-bottom: 1.5em;
      box-sizing: border-box;
      padding: 1em 1em;
      font-family: courier;

      @media (min-width: 576px) {
        width: 100%;
      }

      .review-element {
        margin-bottom: 1em;

        span.val {
          display: block;
          overflow-y: hidden;
          background: rgba(0,0,0,0.2);
        }

        .label-wrap {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }

        label {
          display: inline-block;
          margin: 0px;
        }

        span.copy {
          display: inline-block;
          font-size:0.9rem;
          text-align: right;
          cursor: pointer;
          color: #00c3ff;
          text-decoration: underline;
        }

      }
    }

    .button-container {
      display: flex;
      gap: 1em;
      width: 100%;
      justify-content: center;
      align-items: center;
      color: var(--sl-color-warning-600);
    }

    hr {
        border-bottom: 1px dashed rgba(255,255,255,0.7);
        border-top: none;
    }

    .more-container { display: none; }
    .more-container-mobile { display: block; }

    @media (min-width: 576px) {
      .more-container { display: block; }
      .more-container-mobile { display: none; }
    }
  `
  
  render() {
    return html`
      <div class="outer">
        <div class="inner">
          <div class="heading-container">
            <img src="/static/img/prompt_b.png" />
            <h1 style="margin-top: 0px; line-height: 1.3; color: white;">Dogebox Security Prompt</h1>
            <div class="more-container" style="margin-top:15px;">
              <hr>
              <a href="#" style="color: rgba(255,255,255,0.7)">Why am I seeing this? <sl-icon name="info-circle-fill" style="position: relative; top: 2px; left:4px"></sl-icon></a>
            </div>
          </div>
          <div class="content-container">
            <div class="message-container">
              <h3><b>Tipjar</b> is requesting you to sign the following transaction:</h3>

              <div class="review-container">

                <div class="review-element">
                  <div class="label-wrap">
                    <label>Amount</label>
                    <span class="copy">copy <sl-icon name="copy"></sl-icon></span>
                  </div>
                  <span class="val">Ð69,000</span>
                </div>

                <div class="review-element">
                  <div class="label-wrap">
                    <label>From</label>
                    <span class="copy">copy <sl-icon name="copy"></sl-icon></span>
                  </div>
                  <span class="val">DH5yaieqoZN36fDVciNyRueRGvGLR3mr7L</span>
                </div>

                <div class="review-element">
                  <div class="label-wrap">
                    <label>To</label>
                    <span class="copy">copy <sl-icon name="copy"></sl-icon></span>
                  </div>
                  <span class="val">DH5yaieqoZN36fDVciNyRueRGvGLR3mr7L</span>
                </div>

              </div>

              <div class="button-container">
                <sl-button variant="warning" size="large">Reject</sl-button>
                <span>OR</span>
                <sl-button variant="warning" size="large">Approve</sl-button>
              </div>

              <div class="more-container-mobile" style="margin-top:15px;">
                <hr>
                <a href="#" style="color: rgba(255,255,255,0.7)">Why am I seeing this? <sl-icon name="info-circle-fill" style="position: relative; top: 2px; left:4px"></sl-icon></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }
}

customElements.define('system-prompt', SystemPrompt);