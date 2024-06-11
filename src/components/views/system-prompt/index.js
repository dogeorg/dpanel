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
      height: 100%;
      width: 100%;
      overflow: hidden;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      // background: rgb(67, 96, 255, 0.5);
      background: rgba(13, 32, 134, 0.6);
    }

    .inner {
      display: flex;
      dispaly: flex-direction: row;
      align-items: center;
      height: 70vh;
      width: 100%;
      background: #4360ff;
      gap: 1em;

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
        background-color: #4360ff;
      }
    }

    .heading-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .message-container {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      align-items: center;
      justify-content: center;
      padding-right: 4em;

      hr {
        border-bottom: 1px dashed rgba(255,255,255,0.7);
        border-top: none;
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
  `
  
  render() {
    return html`
      <div class="outer">
        <div class="inner">
          <div class="heading-container">
            <img src="/static/img/prompt_b.png" style="width: 300px;"/>
            <h1 style="margin-top: 0px; line-height: 1.3; color: white;">Dogebox<br>Security Prompt</h1>
          </div>
          <div class="message-container">
            <h3><b>Tipjar</b> is requesting you to sign a transaction</h3>
            <div class="button-container">
              <sl-button variant="warning" size="large">Reject</sl-button>
              <span>OR</span>
              <sl-button variant="warning" size="large">Approve</sl-button>
            </div>
            <div class="more-container" style="margin-top:15px;">
              <hr>
              <a href="#" style="color: rgba(255,255,255,0.7)">Why am I seeing this? <sl-icon name="info-circle-fill" style="position: relative; top: 2px; left:4px"></sl-icon></a>
            </div>
          </div>
        </div>
      </div>
    `
  }
}

customElements.define('system-prompt', SystemPrompt);