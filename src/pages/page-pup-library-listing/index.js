import {
  LitElement,
  html,
  css,
  nothing,
  choose,
  unsafeHTML,
} from "/vendor/@lit/all@3.1.2/lit-all.min.js";
import "/components/common/action-row/action-row.js";
import "/components/common/dynamic-form/dynamic-form.js";
import "/components/views/x-check/index.js";
import "/components/common/page-container.js";
import { bindToClass } from "/utils/class-bind.js";
import * as renderMethods from "./renders/index.js";
import { store } from "/state/store.js";
import { StoreSubscriber } from "/state/subscribe.js";
import { pkgController } from "/controllers/package/index.js";
import { asyncTimeout } from "/utils/timeout.js";
import { createAlert } from "/components/common/alert.js";

class PupPage extends LitElement {
  static get properties() {
    return {
      open_dialog: { type: Boolean },
      open_dialog_label: { type: String },
      checks: { type: Object },
      pupEnabled: { type: Boolean },
      _confirmedName: { type: String },
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
    this.checks = [];
    this.pupEnabled = false;
    this._confirmedName = "";
  }

  connectedCallback() {
    super.connectedCallback();
    // Observers with a pupId will be requested to
    // update when state for that pup changes
    this.pupId = this.context.store.pupContext.manifest.id;
    this.pupEnabled = this.pkgController.getPup(this.pupId)?.state?.enabled
    this.pkgController.addObserver(this);
  }

  disconnectedCallback() {
    this.pkgController.removeObserver(this);
    super.disconnectedCallback();
  }

  async firstUpdated() {
    this.addEventListener("sl-hide", this.handleDialogClose);
    this.checks = this.context.store.pupContext?.manifest?.checks;

    if (this.pupId === "Core") {
      await asyncTimeout(1200);
      this.checks[1].status = "success";
      this.requestUpdate();

      await asyncTimeout(800);
      this.checks[2].status = "success";
      this.requestUpdate();
    }
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

  submitConfig = async (stagedChanges, formNode, dynamicForm) => {
    // Define callbacks
    const callbacks = {
      onSuccess: () => dynamicForm.commitChanges(formNode),
      onError: (errorPayload) => {
        dynamicForm.retainChanges(); // To cease the form from spinning
        this.displayConfigUpdateErr(errorPayload); // Display a failure banner
      },
    };

    // Invoke pkgContrller model update, supplying data and callbacks
    const res = await pkgController.requestPupChanges(
      this.pupId,
      stagedChanges,
      callbacks,
    );
    if (res && !res.error) {
      return true;
    }
  };

  displayConfigUpdateErr(failedTxnPayload) {
    const failedTxnId = failedTxnPayload?.id ? `(${failedTxnPayload.id})` : "";
    const message = [
      "Failed to update configuration",
      `Refer to logs ${failedTxnId}`,
    ];
    const action = { text: "View details" };
    const err = new Error(failedTxnPayload.error);
    const hideAfter = 0;

    createAlert(
      "danger",
      message,
      "exclamation-diamond",
      hideAfter,
      action,
      err,
    );
  }

  async handleStartStop(e) {
    this.inflight = true;
    this.pupEnabled = e.target.checked;
    this.requestUpdate();

    const actionName = e.target.checked ? 'start' : 'stop' ;
    const callbacks = {
      onSuccess: () => console.log('WOW'),
      onError: () => console.log('NOO..'),
      onTimeout: () => { console.log('TOO SLOW..'); this.inflight = false; }
    }
    await this.pkgController.requestPupAction(this.pupId, actionName, callbacks);
  }

  async handleUninstall(e) {
    this.pupEnabled = false;
    this.inflight = true;
    this.requestUpdate();

    const actionName = 'uninstall'
    const callbacks = {
      onSuccess: () => console.log('WOW'),
      onError: () => console.log('NOO..'),
      onTimeout: () => { console.log('TOO SLOW..'); this.inflight = false; }
    }
    await this.pkgController.requestPupAction(this.pupId, actionName, callbacks);
    await asyncTimeout(1500);
    this._confirmedName = "";
    this.clearDialog();
  }

  render() {
    const path = this.context.store?.appContext?.path || [];
    const pkg = this.pkgController.getPup(this.context.store.pupContext.manifest.id);
    const { installationId, statusId, statusLabel } = pkg.computed
    const hasChecks = (pkg?.manifest?.checks || []).length > 0;
    const isLoadingStatus =  ["starting", "stopping", "crashing"].includes(statusId);

    const renderHealthChecks = () => {
      return this.checks.map(
        (check) => html`
          <health-check status=${check.status} .check=${check} ?disabled=${!this.pupEnabled}></health-check>
        `,
      );
    };

    const renderStatusAndActions = () => {
      return html`
        ${this.renderStatus()}
        <sl-progress-bar value="0" ?indeterminate=${isLoadingStatus} class="loading-bar ${statusId}"></sl-progress-bar>
        ${this.renderActions()}
      `
    }

    const renderMenu = () => html`
      <action-row prefix="power" name="state" label="Enabled">
        Enable or disable this Pup
        <sl-switch slot="suffix" ?checked=${pkg.state.enabled} @sl-input=${this.handleStartStop} ?disabled=${this.inflight || installationId === "unready"}></sl-switch>
      </action-row>

      <action-row prefix="gear" name="configure" label="Configure" .trigger=${this.handleMenuClick}>
        Customize ${pkg.manifest.package}
      </action-row>

      <!--action-row prefix="archive-fill" name="properties" label="Properties" .trigger=${this.handleMenuClick}>
        Ea sint dolor commodo.
      </action-row-->

      <!--action-row prefix="lightning-charge" name="actions" label="Actions" .trigger=${this.handleMenuClick}>
        Ea sint dolor commodo.
      </action-row-->

      <action-row prefix="display" name="logs" label="Logs" href="${window.location.pathname}/logs">
        Unfiltered logs
      </action-row>
    `;

    const renderMore = () => html`
      <action-row prefix="list-ul" name="readme" label="Read me" .trigger=${this.handleMenuClick}>
        Many info
      </action-row>

      <action-row prefix="box-seam" name="deps" label="Dependencies" .trigger=${this.handleMenuClick}>
        View software this Pup depends on
      </action-row>
    `

    const renderCareful = () => html`
      <action-row prefix="trash3-fill" name="uninstall" label="Uninstall" .trigger=${this.handleMenuClick}>
        Remove this pup from your system
      </action-row>
    `

    return html`
      <div id="PageWrapper" class="wrapper">
        <section>
          <div class="section-title">
            <h3>Status</h3>
          </div>
          ${renderStatusAndActions()}
        </section>

        <section>
          <div class="section-title">
            <h3>Menu</h3>
          </div>
          <div class="list-wrap">${renderMenu()}</div>
        </section>

        ${hasChecks ? html`
        <section>
          <div class="section-title">
            <h3>Health checks</h3>
          </div>
          <div class="list-wrap">${renderHealthChecks()}</div>
        </section>`
        : nothing }

        <section>
          <div class="section-title">
            <h3>Such More</h3>
          </div>
          <div class="list-wrap">${renderMore()}</div>
        </section>

        <section>
          <div class="section-title">
            <h3>Much Care</h3>
          </div>
          <div class="list-wrap">${renderCareful()}</div>
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
      --indi: #777;
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

    .loading-bar {
      --height: 1px;
      --track-color: #444;
      --indicator-color: #999;
      &.starting { --indicator-color: var(--sl-color-primary-600); }
      &.stopping { --indicator-color: var(--sl-color-danger-600); }
    }
  `;
}

customElements.define("x-page-pup-library-listing", PupPage);
