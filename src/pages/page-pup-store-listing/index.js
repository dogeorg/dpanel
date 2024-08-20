import {
  LitElement,
  html,
  css,
  nothing,
  choose,
  unsafeHTML,
  classMap,
} from "/vendor/@lit/all@3.1.2/lit-all.min.js";
import { bindToClass } from "/utils/class-bind.js";
import * as renderMethods from "./renders/index.js";
import { store } from "/state/store.js";
import { StoreSubscriber } from "/state/subscribe.js";
import { pkgController } from "/controllers/package/index.js";
import { asyncTimeout } from "/utils/timeout.js";
import "/components/common/action-row/action-row.js";
import "/components/common/reveal-row/reveal-row.js";
import "/components/common/page-container.js";

class PupInstallPage extends LitElement {
  static get properties() {
    return {
      open_dialog: { type: Boolean },
      open_dialog_label: { type: String },
      busy: { type: Boolean },
      inflight: { type: Boolean },
    };
  }

  constructor() {
    super();
    bindToClass(renderMethods, this);
    this.pkgController = pkgController;
    this.context = new StoreSubscriber(this, store);
    this.open_dialog = false;
    this.open_dialog_label = "";
    this.open_page = false;
    this.open_page_label = "";
    this.busy = false;
    this.inflight = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.pupId = this.context.store.pupContext.manifest.id;
    this.pkgController.addObserver(this);
  }

  disconnectedCallback() {
    this.pkgController.removeObserver(this);
    super.disconnectedCallback();
  }

  async firstUpdated() {
    this.addEventListener("sl-hide", this.handleDialogClose);
  }

  handleDialogClose() {
    this.clearDialog();
  }

  clearDialog() {
    this.open_dialog = false;
    this.open_dialog_label = "";
  }

  handleMenuClick = (event, el) => {
    this.open_dialog = el.getAttribute("name");
    this.open_dialog_label = el.getAttribute("label");
  };

  render() {
    const path = this.context.store?.appContext?.path || [];
    const pkg = this.pkgController.getPup(this.context.store.pupContext.manifest.id);
    const { statusId, statusLabel, installationId, installationLabel } = pkg.computed
    const isInstalled = installationId === "installed";
    const isLoadingStatus = ["installing"].includes(statusId);
    const hasDependencies = (pkg?.manifest?.deps?.pups || []).length > 0
    const popover_page = path[1];

    const wrapperClasses = classMap({
      wrapper: true,
      installed: ["ready", "unready"].includes(installationId),
    });

    const renderStatusAndActions = () => {
      return html`
        ${this.renderStatus()}
        <sl-progress-bar class="loading-bar" value="0" ?indeterminate=${isLoadingStatus}></sl-progress-bar>
        ${this.renderActions()}
      `
    }

    const renderDependancyList = () => {
      return pkg.manifest.deps.pups.map((dep) => html`
        <action-row prefix="box-seam" name=${dep.id} label=${dep.name} href=${`/explore/${dep.id}/${dep.name}`}>
          ${dep.condition}
        </action-row>
      `);
    };

    return html`
      <div id="PageWrapper" class="${wrapperClasses}" ?data-freeze=${popover_page}>
        <section class="status">
          <div class="section-title">
            <h3 class="installation-label ${installationId}">${installationLabel}</h3>
          </div>
          ${renderStatusAndActions()}
        </section>

        <section>
          <div class="section-title">
            <h3>Description</h3>
            <reveal-row>
              <p>${pkg?.manifest?.docs?.short}<br/>${pkg?.manifest?.docs?.long}</p>
            </reveal-row>
          </div>
        </section>

        ${hasDependencies ? html`
          <section>
            <div class="section-title">
              <h3>Dependencies</h3>
            </div>
            <div class="grid-list-wrap">
              ${renderDependancyList()}
            </div>
          </section>`
          : nothing
        }

        <section>
          <div class="section-title">
            <h3>Such Info</h3>
          </div>
          <div class="list-wrap">
            <action-row prefix="list-ul" name="readme" label="Read me" .trigger=${this.handleMenuClick}>
              Many info
            </action-row>
          </div>
        </section>

      </div>

      <aside>
        <sl-dialog
          class="distinct-header"
          id="PupMgmtDialog"
          ?open=${this.open_dialog}
          label=${this.open_dialog_label}
        >
          ${this.renderDialog()}
        </sl-dialog>
      </aside>
    `;
  }

  static styles = css`
    :host {
      position: relative;
      display: block;
    }

    .wrapper {
      display: block;
      padding: 2em;
      position: relative;
    }

    .wrapper[data-freeze] {
      overflow: hidden;
    }

    h1,
    h2,
    h3 {
      margin: 0;
      padding: 0;
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

    .wrapper section.status .section-title h3 {
      font-weight: 100;
      color: var(--sl-color-warning-700);

      &.installing {
        color: var(--sl-color-warning-700);
      }

      &.installed {
        color: rgb(0, 195, 255);
      }

      &.broken {
        color: #fe5c5c;
      }
    }

    .wrapper.installed section.status .section-title h3 {
      color: #00c3ff;
    }

    section div.underscored {
      border-bottom: 1px solid #333;
    }

    aside.page-popver {
      display: none;
      position: fixed;
      top: 80px;
      left: 0;
      height: calc(100vh - 80px);
      width: calc(100vw - var(--page-margin-left));
      margin-left: var(--page-margin-left);
      z-index: 600;
      box-sizing: border-box;
      overflow-x: hidden;
      overflow-y: auto;
      background: #23252a;
    }

    aside.page-popver[data-open] {
      display: block;
    }

    sl-dialog.distinct-header::part(header) {
      z-index: 960;
      background: rgb(24, 24, 24);
    }

    .grid-list-wrap {
      display: grid;
      row-gap: 0.5em;
      column-gap: 2em;
      grid-template-columns: 1fr;

      @media (min-width: 576px) {
        grid-template-columns: 1fr 1fr; /* Two columns of equal width */
      }
    }

    .loading-bar {
      --indicator-color:var(--sl-color-amber-700);
      --height: 1px;
    }
  `;
}

customElements.define("x-page-pup-store-listing", PupInstallPage);
