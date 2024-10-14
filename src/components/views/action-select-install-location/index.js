import {
  LitElement,
  html,
  css,
  nothing,
} from "/vendor/@lit/all@3.1.2/lit-all.min.js";
import { createAlert } from "/components/common/alert.js";
import { asyncTimeout } from "/utils/timeout.js";

export class LocationPickerView extends LitElement {
  static get properties() {
    return {
      _ready: { type: Boolean },
      _open: { type: Boolean },
    };
  }

  constructor() {
    super();
    this._ready = false;
    this._open = false;
  }

  firstUpdated() {
    this.fetch();
  }

  fetch() {
    this._open = true;
  }

  render() {
    return html`
      <sl-dialog ?open=${this._open} no-header>
        <div class="wrap">
          <h1>Heading</h1>
          <p>Explanation</p>
          <sl-button ?disabled=${true} @click=${this.handleProceed}
            ><div class="button a">A</div></sl-button
          >
          <sl-button ?disabled=${false} @click=${this.handleChange}
            ><div class="button b">B</div></sl-button
          >
          <p>Finally</p>
        </div>
      </sl-dialog>
    `;
  }

  handleProceed() {
    createAlert("success", "woot");
    return;
  }

  handleChange() {
    createAlert("warning", "meow");
    return;
  }

  static styles = css`
    .wrap {
      text-align: center;
    }
    .button {
      height: 100px;
      width: 100px;
    }
  `;
}

customElements.define("action-select-install-location", LocationPickerView);
