import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import { getRouter } from '/router/router.js'
import '/components/common/render-count.js'
import '/components/common/dynamic-form/dynamic-form.js'

class PracticeFormView extends LitElement {

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
    const router = getRouter();
    console.log(router.location.pathname);
  }

  render() {
    return html`
      <div class="padded">
        <h1>Very Form</h1>

        <div>
          <dynamic-form></dynamic-form>
        </div>

      </div>
    `;
  }
}

customElements.define('practice-form-view', PracticeFormView);
