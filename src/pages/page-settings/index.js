import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import '/components/common/render-count.js'

class SettingsPage extends LitElement {

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
        <h1>So Settings</h1>

        Rendered: <render-count></render-count>
      </div>
    `;
  }
}

customElements.define('x-page-settings', SettingsPage);
