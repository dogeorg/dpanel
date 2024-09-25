  import {
    LitElement,
    html,
    css,
    nothing,
  } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

  import "/components/common/tag-set/tag-set.js";

  class PupInstallCard extends LitElement {
    static get properties() {
      return {
        pupId: { type: String },
        pupName: { type: String },
        logoBase64: { type: String },
        defaultIcon: { type: String },
        version: { type: String },
        short: { type: String },
        status: { type: String },
        running: { type: Boolean },
        hasGui: { type: Boolean },
        href: { type: String },
        gref: { type: String },
        upstreamVersions: { type: Object },
      };
    }

    constructor() {
      super();
      this.href = ""
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
      const { defaultIcon, pupName, version, logoBase64, status, gui, short, href, upstreamVersions } = this;
      return html`
        <a class="anchor" href=${href} target="_self">
          <div class="pup-card-wrap">
            <div class="icon-wrap ${logoBase64 ? 'has-logo' : ''}">
              ${logoBase64 ? html`<img style="width: 100%" src="${logoBase64}" />` : html`<sl-icon name="${defaultIcon}"></sl-icon>`}
            </div>
            <div class="details-wrap">
              <div class="inner">
                <span class="name">${pupName}  <small style="color: #777">v${version}</small></span>
                <span class="description">${short}</span>
                <x-tag-set .tags=${upstreamVersions} highlight max=1></x-tag-set>
                <span class="status">${status === "running" ? "Installed" : status}</span>
              </div>
            </div>
          </div>
        </a>
      `;
    }

    static styles = css`
      :host {
        --icon-size: 72px;
        --row-height: 114px;
      }

      a, button {
        touch-action: manipulation;
      }

      .anchor {
        touch-action: manipulation;
        text-decoration: none;
        color: inherit;
      }

      :host([installed]) .icon-wrap {
        background: #4d4d4d;
      }

      .pup-card-wrap {
        display: flex;
        flex-direction: row;
        margin-bottom: 1em;
        width: 100%;
        padding: 1em;
        box-sizing: border-box;
        overflow: hidden;
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

      .icon-wrap.has-logo {
        background: none;
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

      span.name {
        font-family: 'Comic Neue';
        font-size: 1.2rem;
        font-weight: bold;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        max-height: 2.4em;
        line-height: 1.2em;
      }

      span.description {
        margin-bottom: 4px;
        font-weight: 100;
        font-size: 0.9rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        max-height: 2em;
        line-height: 1em;
      }

      span.version {
        font-weight: 100;
        font-size: 0.9rem;
      }

      span.status {
        line-height: 1.5;
        text-transform: capitalize;
        color: #00c3ff;
        font-size: 0.9rem;
      }
    `;
  }

  customElements.define("pup-install-card", PupInstallCard);