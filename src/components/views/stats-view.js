import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

class StatsView extends LitElement {

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
        <h1>Very Stats</h1>
      </div>
    `;
  }
}

customElements.define('stats-view', StatsView);