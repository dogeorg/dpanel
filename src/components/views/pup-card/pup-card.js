  import {
    LitElement,
    html,
    css,
    nothing,
  } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

  class PupCard extends LitElement {
    static get properties() {
      return {
        icon: { type: String },
        pupId: { type: String },
        pupName: { type: String },
        version: { type: String },
        status: { type: String },
        running: { type: Boolean },
        gui: { type: Object },
      };
    }

    constructor() {
      super();
    }

    get status() {
      return this._status;
    }

    set status(newStatus) {
      this._status = newStatus;
      this.running = newStatus === 'running';
      this.requestUpdate();
    }

    render() {
      const { pupName, version, icon, status, gui } = this;
      return html`
        <div class="pup-card-wrap">

          <div class="icon-wrap">
            <sl-icon name="${icon}"></sl-icon>
          </div>

          <div class="details-wrap">
            <div class="inner">
              <span class="name">${pupName}</span>
              <span class="version">${version}</span>
              <span class="status">${status === "running" ? "Enabled" : status}</span>
            </div>
          </div>

          <div class="suffix-wrap">
            ${gui ? html`
              <sl-icon-button 
                class="cta"
                variant="link"
                href="${gui.source}" 
                target="_self"
                name="box-arrow-up-right">
              </sl-icon-button>
            ` : nothing }
          </div>

        </div>
      `;
    }

    static styles = css`
      :host {
        --icon-size: 72px;
        --row-height: 84px;
      }

      .pup-card-wrap {
        display: flex;
        flex-direction: row;
        margin-bottom: 1em;
        width: 100%;
        padding: 1em;
        box-sizing: border-box;
      }

      .pup-card-wrap:hover {
        background: rgb(46, 45, 51);
        cursor: pointer;
      }

      .icon-wrap {
        flex: 1 0 auto; /* can grow, cannot shrink */
        display: flex;
        width: var(--icon-size);
        height: var(--icon-size);
        border-radius: 84px;
        background: #e39704;
        justify-content: center;
        align-items: center;
        font-size: 2em;
        box-sizing: border-box;
        margin-right: 0.5em;
        margin-top: calc((var(--row-height) - var(--icon-size)) / 2);
      }

      .details-wrap {
        flex: 1 1 auto; /* can grow, can shrink */
        display: flex;
        align-items: center;
        border-bottom: 1px solid #333;
        width: 100%;
        height: var(--row-height);
      }

      .details-wrap .inner {
        display: flex;
        flex-direction: column;
        align-items: start;
        line-height: 1.3;
      }

      .suffix-wrap {
        flex: 0 0 auto; /* cannot grow, cannot shrink */
        width: 24px;
        height: var(--row-height);
        border-bottom: 1px solid #333;
        display: flex;
        align-items: center;

        .cta {
          position: relative;
          bottom: 0px;
          left: -1em;
        }
      }

      span.name {
        font-family: 'Comic Neue';
        font-size: 1.2rem;
        font-weight: bold;
      }

      span.version {
        font-weight: 100;
        font-size: 0.9rem;
      }

      span.status {
        line-height: 1.5;
        text-transform: capitalize;
        color: #2ede75;
        font-size: 0.9rem;
      }
    `;
  }

  customElements.define("pup-card", PupCard);