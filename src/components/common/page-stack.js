import { LitElement, html, css, nothing } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

class PageStack extends LitElement {

  static styles = css``;

  static properties = {}

  constructor() {
    super();
    this.stack = [];
  }

  render() {
    return html`
      <slot></slot>
    `
  }
}

customElements.define('page-stack', PageStack);
