import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import { getRouter } from '/router/router.js'
import '/components/common/render-count.js'

class PupManagementView extends LitElement {

  static styles = css`
    .padded {
      padding: 20px;
    }
    h1 {
      font-family: 'Comic Neue', sans-serif;
    }
  `

  firstUpdated() {
    // Demonstration of accessing the router within other components
    const { router } = getRouter();
  }

  render() {
    return html`
      <div class="padded">
        <h1>So Pup!</h1>

        Rendered: <render-count></render-count>
      </div>
    `;
  }
}

customElements.define('pup-management-view', PupManagementView);
