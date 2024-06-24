import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

class ApSetupView extends LitElement {

  static styles = css`
    main {
      max-width: 576px;
      display: block;
      margin: 0 auto;
    }
    .padded {
      padding: 20px;
    }
    h1 {
      font-family: 'Comic Neue', sans-serif;
      text-align: center;
    }
  `

  render() {
    return html`
      <main>
        <div class="padded">
          <h1>Such Network</h1>
        </div>
      </main>
    `;
  }
}

customElements.define('view-ap-setup', ApSetupView);