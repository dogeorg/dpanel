import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

class WelcomeDialog extends LitElement {

  static styles = css`
    .padded {
      padding: 20px;
    }

    h1 {
      font-family: 'Comic Neue', sans-serif;
    }

    .welcome-body {
      margin-top: -1px;
      margin-left: -1px;
    }

    .welcome-body img {
      width: 100%;
    }

    .footer-text-wrap {
      text-align: left;
    }

    .footer-text-wrap p.heading {
      font-family: 'Comic Neue';
      font-weight: bold;
      font-size: 1.2rem;
      padding-top: 0px;
      margin-top: 0px;
    }
  `

  render() {
    return html`
      <sl-dialog open no-header style="--body-spacing: 0;">
      <div class="welcome-body">
        <img src="/static/img/dogebox-logo.jpg" />
      </div>
      <div class="welcome-footer" slot="footer">
        <div class="footer-text-wrap">
          <p class="heading"><b>Introducing Dogebox 🎉</b></p>
          Amet adipisicing sint duis cillum pariatur aliqua anim eu in cupidatat occaecat et tempor sit excepteur tempor ullamco sit magna non amet excepteur do anim est.
        </div>
        <sl-divider></sl-divider>
        <sl-button variant="warning">MUCH WOW</sl-button>
      </div>
      </sl-dialog>
    `;
  }
}

customElements.define('welcome-dialog', WelcomeDialog);
