import { LitElement, html, css, nothing } from "/vendor/@lit/all@3.1.2/lit-all.min.js";
import { asyncTimeout } from "/utils/timeout.js";

export class DependencyManageView extends LitElement {

  static get properties() {
    return {
      _ready: { type: Boolean },
    }
  }

  constructor() {
    super();
    this._ready = true;
  }

  firstUpdated() {}

  render() {
    return html`Dependency List Woot`
  }

  static styles = css`` 
}

customElements.define("x-action-manage-deps", DependencyManageView);