import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

class PupsView extends LitElement {

  static styles = css`
    .padded {
      padding: 20px;
    }
    h1 {
      font-family: 'Comic Neue', sans-serif;
    }
  `

  render() {
    return html`
      <div class="padded">
        <h1>Much Pups</h1>
      </div>
    `;
  }
}

customElements.define('pups-view', PupsView);