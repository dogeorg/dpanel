import { LitElement, html, css, ifDefined } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import { getRouter } from '/router/router.js'
import { StoreSubscriber } from '/state/subscribe.js';
import { store } from '/state/store.js';
import '/components/common/render-count.js'
import '/components/common/dynamic-form/dynamic-form.js'
import * as dataSets from '/components/common/dynamic-form/mocks/index.js'
const ifd = ifDefined;

class PracticeFormView extends LitElement {

  static properties = {
    key: {type: String },
    data: { type: Object }
  }

  static styles = css`
    :host {
      display: block;
      height: 100vh;
      width: 100%;
      overflow-y: auto;
    }
    .header {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 2em;
      padding-bottom: 1em;
      border-bottom: 1px solid #444;
      margin-bottom: 2em;
    }
    .padded {
      padding: 20px;
    }
    h1 {
      font-family: 'Comic Neue', sans-serif;
    }
    sl-option::part(base) {
      text-transform: capitalize;
    }
    sl-select::part(label) {
      text-transform: capitalize;
    }
  `

  constructor() {
    super();
    // Subscribe to changes of appContext
    this.context = new StoreSubscriber(this, store)
  }

  firstUpdated() {
    // Demonstration of accessing the router within other components
    const router = getRouter();
    // console.log(router.location.pathname);
    this.forceDataSet('split')
  }

  forceDataSet(keyName) {
    this.key = keyName
    this.data = dataSets[keyName]
  }

  onDatasetChange(event) {
    this.key = event.target.value
    this.data = dataSets[event.target.value]
    console.log({ key: this.key, set: this.data });
  }

  render() {
    const { appContext } = this.context.store
    const options = Object.keys(dataSets).map((key, i) => {
      return html`<sl-option value="${key}">${key}</sl-option>`;
    });

    return html`
      <div class="padded">
        <div class="header">
          <h1>Very Form</h1>
          <sl-select size="small" label="Select mock data set" value=${this.key} @sl-change="${this.onDatasetChange}">
            ${options}
          </sl-select>
        </div>

        <div>
          <dynamic-form
            .data="${ifd(this.data)}"
            orientation=${appContext.orientation}>
          </dynamic-form>
        </div>
      </div>
    `;
  }
}

customElements.define('form-view', PracticeFormView);
