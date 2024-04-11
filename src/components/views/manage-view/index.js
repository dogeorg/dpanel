import { LitElement, html, css, nothing, repeat } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import '/components/views/pup-snapshot/pup-snapshot.js'
import '/components/views/pup-snapshot/pup-snapshot-skeleton.js'
import { getBootstrap } from '/api/bootstrap/bootstrap.js';
import { pkgController } from '/models/package/index.js'
import { PaginationController } from '/components/common/paginator/paginator-controller.js';
import { bindToClass } from '/utils/class-bind.js'
import * as renderMethods from './renders/index.js';
import '/components/common/paginator/paginator-ui.js';

class ManageView extends LitElement {

  static properties = {
    fetchLoading: { type: Boolean },
    fetchError: { type: Boolean },
    packageList: { type: Array },
    busy: { type: Boolean }
  }

  constructor() {
    super();
    this.busy = false;
    this.busyQueue = [];
    this.fetchLoading = true;
    this.fetchError = false;
    this.itemsPerPage = 20;
    this.pkgController = pkgController;
    this.installedList = new PaginationController(this, undefined, this.itemsPerPage);
    this.availableList = new PaginationController(this, undefined, this.itemsPerPage);
    bindToClass(renderMethods, this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.pkgController.addObserver(this);
    this.addEventListener('busy-start', this.handleBusyStart.bind(this));
    this.addEventListener('busy-stop', this.handleBusyStop.bind(this));
    this.addEventListener('pup-installed', this.handlePupInstalled.bind(this));
    this.fetchBootstrap();
  }

  disconnectedCallback() {
    this.removeEventListener('busy-start', this.handleBusyStart.bind(this));
    this.removeEventListener('busy-stop', this.handleBusyStop.bind(this));
    this.removeEventListener('pup-installed', this.handlePupInstalled.bind(this));
    this.pkgController.removeObserver(this);
    super.disconnectedCallback();
  }

  reset() {
    this.fetchLoading = true;
    this.fetchError = false;
    this.packageList = null;
  }

  updateBusyState() {
    this.busy = this.busyQueue.length > 0;
  }

  handleBusyStart(event) {
    this.busyQueue.push(event.target);
    this.updateBusyState();
  }

  handleBusyStop(event) {
    // Remove the identifier of the event source from the queue
    const index = this.busyQueue.indexOf(event.target);
    if (index > -1) {
      this.busyQueue.splice(index, 1);
    }
    setTimeout(() => {
      this.updateBusyState();
    }, 500);
  }

  handlePupInstalled(event) {
    event.stopPropagation();
    this.pkgController.installPkg(event.detail.pupId)
    this.requestUpdate();
  }

  async fetchBootstrap() {
    this.reset();
    // Emit busy start event which adds this action to a busy-queue.
    this.dispatchEvent(new CustomEvent('busy-start', {}));

    try {
      const res = await getBootstrap()
      this.pkgController.setData(res);
      this.installedList.setData(this.pkgController.installed);
      this.availableList.setData(this.pkgController.available);
    } catch (err) {
      console.log(err);
      this.fetchError = true;
    } finally {
      // Emit a busy stop event which removes this action from the busy-queue.
      this.dispatchEvent(new CustomEvent('busy-stop', {}));
      this.fetchLoading = false
    }
  }

  handleActionsMenuSelect(event) {
    const selectedItemValue = event.detail.item.value;
    switch (selectedItemValue) {
      case 'refresh':
        this.fetchBootstrap();
        break;
    }
  }

  render() {
    const ready = (
      !this.fetchLoading &&
      !this.fetchError &&
      this.installedList.data &&
      this.availableList.data
    )

    const hasItems = (listNickname) => {
      switch(listNickname) {
        case 'installed':
          return Boolean(this.installedList.data.length)
          break;
        case 'available':
          return Boolean(this.availableList.data.length)
          break;
      }
    }

    const SKELS = Array.from({ length: 1 })

    return html`

      <div class="top">
        ${this.renderSectionTop()}
      </div>

      <div class="padded">
        <header>
          ${this.renderSectionInstalledHeader(ready)}
        </header>
          ${this.renderSectionInstalledBody(ready, SKELS, hasItems)}
      </div>

      <div class="padded">
        <header>
          ${this.renderSectionAvailableHeader(ready)}
        </header>
          ${this.renderSectionAvailableBody(ready, SKELS, hasItems)}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      height: 100%;
      width: 100%;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .top {
      display: none;
      margin: 1.5em 2em 2em 2em; 
    }

    .padded {
      background: #1a191f;
      border: 1px solid rgb(32, 31, 36);
      border-radius: 16px;
      margin: 1em;
      padding: 1em;
      @media (min-width: 1024px) {
        padding: 1.4em;
        padding-top: 0em;
      }
    }

    h1, h2 {
      font-family: 'Comic Neue', sans-serif;
      color: #07ffae;
    }

    header {
      display: flex;
      flex-direction: row;
      align-items: baseline;
      justify-content: space-between;
      gap: 0.8rem;
    }

    header .heading-wrap {
      display: flex;
      gap: 0.8rem;
      align-items: baseline;
    }

    header .heading-wrap h2 {
      margin-top: 0px;
      @media (min-width: 1024px) {
        margin-top: 1em;
      }
    }

    header .header-actions {
      display: flex;
      flex-direction: row;
      gap: 0.85em;
      margin-left: auto;
    }

    /* Details toggle */
    .details-group pup-snapshot:not(:last-of-type),
    .details-group pup-snapshot-skeleton:not(:last-of-type) {
      margin-bottom: var(--sl-spacing-x-small);
    }

    .empty {
      width: 100%;
      color: var(--sl-color-neutral-600);
      box-sizing: border-box;
      border: dashed 1px var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      padding: var(--sl-spacing-x-large) var(--sl-spacing-medium);
    }
  `
}

customElements.define('manage-view', ManageView);
