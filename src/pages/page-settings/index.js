import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import '/components/common/render-count.js'
import '/components/common/action-row/action-row.js';

class SettingsPage extends LitElement {

  static styles = css`
    .padded {
      padding: 20px;
    }
    h1 {
      font-family: 'Comic Neue', sans-serif;
    }

    section {
      margin-bottom: 2em;
    }

    section div {
      margin-bottom: 1em;
    }

    section .section-title {
      margin-bottom: 0em;
    }

    section .section-title h3 {
      text-transform: uppercase;
      font-family: "Comic Neue";
    }
  `

  render() {
    return html`
      <div class="padded">

        <section>
          <div class="section-title">
            <h3>Menu</h3>
          </div>
          <div class="list-wrap">
            <action-row prefix="wifi" label="Wifi">
              Add or remove Wifi networks
            </action-row>
          <div class="list-wrap">
        </section>

        <section>
          <div class="section-title">
            <h3>Power</h3>
          </div>
          <action-row prefix="power" label="Shutdown">
            Gracefully shutdown your Dogebox
          </action-row>

          <action-row prefix="arrow-counterclockwise" label="Restart">
            Gracefully restart your Dogebox
          </action-row>
        </section>

      </div>
    `;
  }
}

customElements.define('x-page-settings', SettingsPage);
