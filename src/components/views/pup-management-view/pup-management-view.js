import { LitElement, html, css, nothing, choose, unsafeHTML } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import { getRouter } from '/router/router.js'
import '/components/common/action-row/action-row.js';
import { bindToClass } from "/utils/class-bind.js";
import * as renderMethods from "./renders/index.js";
import { store } from "/state/store.js";
import { StoreSubscriber } from "/state/subscribe.js";

class PupManagementView extends LitElement {

  static get properties() {
    return {
      open_dialog: { type: Boolean },
      open_dialog_label: { type: String }
    }
  }

  constructor() {
    super();
    bindToClass(renderMethods, this);
    this.context = new StoreSubscriber(this, store);
    this.open_dialog = false;
    this.open_dialog_label = ""
  }

  static styles = css`
    :host {
      display: block;
      height: calc(100vh + -80px); /* accounts for page header*/
      overflow-y: auto;
      padding: 2em;
    }

    h1, h2, h3 {
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
      font-family: 'Comic Neue';
    }

    section div.underscored {
      border-bottom: 1px solid #333;
    }
  `

  firstUpdated() {
    this.addEventListener('sl-hide', this.handleDialogClose)
  }

  handleDialogClose() {
    this.clearDialog();
  }

  clearDialog() {
    this.open_dialog = false;
    this.open_dialog_label = "";
  }

  handleMenuClick = (event, menuRowInstance) => {
    this.open_dialog = menuRowInstance.getAttribute("name");
    this.open_dialog_label = menuRowInstance.getAttribute("label")
  }

  render() {
    const pkg = this.context.store.pupContext
    console.log(pkg);

    const renderHealthChecks = () => html`
      <action-row label="Blockchain Sync" prefix="arrow-repeat">
        Ea sint dolor commodo.
      </action-row>

      <action-row label="Inbound Connections" prefix="box-arrow-in-down">
        Ea sint dolor commodo.
      </action-row>

      <action-row label="Outbond Connections" prefix="box-arrow-up">
        Ea sint dolor commodo.
      </action-row>
    `;
    const renderMenu = () => html`
      <action-row prefix="list-ul" name="readme" label="Readme" .trigger=${this.handleMenuClick}>
        Ea sint dolor commodo.
      </action-row>

      <action-row prefix="gear" name="configure" label="Configure" .trigger=${this.handleMenuClick}>
        Ea sint dolor commodo.
      </action-row>

      <action-row prefix="archive-fill" name="properties" label="Properties" .trigger=${this.handleMenuClick}>
        Ea sint dolor commodo.
      </action-row>

      <action-row prefix="lightning-charge" name="actions" label="Actions" .trigger=${this.handleMenuClick}>
        Ea sint dolor commodo.
      </action-row>

      <action-row prefix="display" name="logs" label="Logs" .trigger=${this.handleMenuClick}>
        Ea sint dolor commodo.
      </action-row>
    `;

    return html`
      
      <section>
        <div class="section-title">
          <h3>Status</h3>
        </div>
        <div class="underscored">
          ${this.renderStatus()}
        </div>
        <div>
          ${this.renderActions()}
        </div>
      </section>

      <section>
        <div class="section-title">
          <h3>Health checks</h3>
        </div>
        <div class="list-wrap">
          ${renderHealthChecks()}
        </div>
      </section>

      <section>
        <div class="section-title">
          <h3>Menu</h3>
        </div>
        <div class="list-wrap">
          ${renderMenu()}
        </div>
      </section>

      <sl-dialog ?open=${this.open_dialog} label=${this.open_dialog_label}>
        ${choose(this.open_dialog, [
          ['readme', () => html`${unsafeHTML(pkg?.manifest?.docs?.about)}`],
          ['configure', () => html`Configurator here.`]
        ],
        () => html`<span>View not provided</span>`)}
      </sl-dialog>
    `;
  }
}

customElements.define('pup-management-view', PupManagementView);
