import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

class LibraryView extends LitElement {

  static styles = css`
    :host {
      display: block;
      height: 100vh;
      overflow-y: auto;
    }
    .padded {
      padding: 20px;
    }
    h1, h2, h3 {
      font-family: 'Comic Neue', sans-serif;
    }
  `

  render() {
    return html`
      <div class="padded">
        <h1>Library View</h1>
      </div>
    `
  }
}

customElements.define('library-view', LibraryView);