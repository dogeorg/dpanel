import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

class PageFoo extends LitElement {

  static get properties() {
    return {
      installationLogs: { type: Array },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.installationLogs = [
      'lorem ipsum dolor sit amet',
      'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
    ];
    this.addMoreLogs();
  }

  addMoreLogs() {
    setInterval(() => {
      console.log('adding more logs');
      this.installationLogs = [...this.installationLogs, 'woot'];
    }, 1000);
  }

  render() {
    return html`
      <div class="pad">
        <h1>Example Page</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </div>

      <div class="pad">
        <x-log-viewer .logs=${this.installationLogs}></x-log-viewer>
      </div>
    `;
  }

  static styles = css`
    .pad {
      padding: 20px;
    }
  `;
}

customElements.define('x-page-foo', PageFoo);