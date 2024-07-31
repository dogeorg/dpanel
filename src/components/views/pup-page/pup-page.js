import {
  LitElement,
  html,
  css,
  nothing,
  choose,
  unsafeHTML,
} from "/vendor/@lit/all@3.1.2/lit-all.min.js";
import { getRouter } from "/router/router.js";
import "/components/common/action-row/action-row.js";
import "/components/views/health-check.js";
import "/components/common/page-container.js";
import { bindToClass } from "/utils/class-bind.js";
import * as renderMethods from "./renders/index.js";
import { store } from "/state/store.js";
import { StoreSubscriber } from "/state/subscribe.js";
import { pkgController } from "/controllers/package/index.js";
import { asyncTimeout } from "/utils/timeout.js";

class PupPage extends LitElement {
  static get properties() {
    return {
      open_dialog: { type: Boolean },
      open_dialog_label: { type: String },
      checks: { type: Object },
    };
  }

  constructor() {
    super();
    bindToClass(renderMethods, this);
    this.pkgController = pkgController;
    this.context = new StoreSubscriber(this, store);
    this.router = getRouter().Router;
    this.open_dialog = false;
    this.open_dialog_label = "";
    this.open_page = false;
    this.open_page_label = "";
    this.checks = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.pkgController.addObserver(this);
  }

  disconnectedCallback() {
    this.pkgController.removeObserver(this);
    super.disconnectedCallback();
  }

  async firstUpdated() {
    this.addEventListener("sl-hide", this.handleDialogClose);
    this.checks = this.context.store.pupContext?.manifest?.command?.checks;

    await asyncTimeout(2000);
    this.checks[1].status = "success";
    this.requestUpdate();

    await asyncTimeout(2000);
    this.checks[2].status = "success";
    this.requestUpdate();
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

  navigateTo = (event, menuRowInstance) => {
    this.router.go(`${window.location.href}/logs`);
  };

  render() {
    const path = this.context.store?.appContext?.path || [];
    const pkg = this.context.store.pupContext;

    const renderHealthChecks = () => {
      return this.checks.map(
        (check) => html`
          <health-check status=${check.status} .check=${check}></health-check>
        `,
      );
    };

    const renderMenu = () => html`
      <action-row
        prefix="list-ul"
        name="readme"
        label="Read me"
        .trigger=${this.handleMenuClick}
      >
        Many info
      </action-row>

      <action-row
        prefix="gear"
        name="configure"
        label="Configure"
        .trigger=${this.handleMenuClick}
      >
        Customize ${pkg.manifest.package}
      </action-row>

      <!--action-row prefix="archive-fill" name="properties" label="Properties" .trigger=${this
        .handleMenuClick}>
        Ea sint dolor commodo.
      </action-row-->

      <!--action-row prefix="lightning-charge" name="actions" label="Actions" .trigger=${this
        .handleMenuClick}>
        Ea sint dolor commodo.
      </action-row-->

      <action-row
        prefix="display"
        name="logs"
        label="Logs"
        .trigger=${this.navigateTo}
      >
        Unfiltered logs
      </action-row>
    `;

    return html`
        <div id="PageWrapper" class="wrapper">
          <section>
            <div class="section-title">
              <h3>Status</h3>
            </div>
            <div class="underscored">${this.renderStatus()}</div>
            <div>${this.renderActions()}</div>
          </section>

          <section>
            <div class="section-title">
              <h3>Health checks</h3>
            </div>
            <div class="list-wrap">${renderHealthChecks()}</div>
          </section>

          <section>
            <div class="section-title">
              <h3>Menu</h3>
            </div>
            <div class="list-wrap">${renderMenu()}</div>
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
  `}

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

    section div.underscored {
      border-bottom: 1px solid #333;
    }

    aside.page-popver[data-open] {
      display: block;
    }

    sl-dialog.distinct-header::part(header) {
      z-index: 960;
      background: rgb(24, 24, 24);
    }
  `;
}

customElements.define("pup-page", PupPage);
