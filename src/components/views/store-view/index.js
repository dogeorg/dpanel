import { LitElement, html, css, nothing, repeat } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import '/components/views/pup-snapshot/pup-snapshot.js'
import '/components/views/pup-snapshot/pup-snapshot-skeleton.js'
import { getBootstrap } from '/api/bootstrap/bootstrap.js';
import { pkgController } from '/controllers/package/index.js'
import { PaginationController } from '/components/common/paginator/paginator-controller.js';
import { bindToClass } from '/utils/class-bind.js'
import * as renderMethods from './renders/index.js';
import '/components/common/paginator/paginator-ui.js';

const initialSort = (a, b) => {
  if (a.manifest.package < b.manifest.package) { return -1; }
  if (a.manifest.package > b.manifest.package) { return 1; }
  return 0;
}

class StoreView extends LitElement {

  static properties = {
    fetchLoading: { type: Boolean },
    fetchError: { type: Boolean },
    busy: { type: Boolean },
    inspectedPup: { type: String },
    searchValue: { type: String }
  }

  constructor() {
    super();
    this.busy = false;
    this.busyQueue = [];
    this.fetchLoading = true;
    this.fetchError = false;
    this.itemsPerPage = 10;
    this.pkgController = pkgController;
    this.packageList = new PaginationController(this, undefined, this.itemsPerPage,{ initialSort });
    this.inspectedPup;
    bindToClass(renderMethods, this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.pkgController.addObserver(this);
    this.addEventListener('busy-start', this.handleBusyStart.bind(this));
    this.addEventListener('busy-stop', this.handleBusyStop.bind(this));
    this.addEventListener('pup-installed', this.handlePupInstalled.bind(this));
    this.addEventListener('forced-tab-show', this.handleForcedTabShow.bind(this));
    this.fetchBootstrap();
  }

  disconnectedCallback() {
    this.removeEventListener('busy-start', this.handleBusyStart.bind(this));
    this.removeEventListener('busy-stop', this.handleBusyStop.bind(this));
    this.removeEventListener('pup-installed', this.handlePupInstalled.bind(this));
    this.removeEventListener('forced-tab-show', this.handleForcedTabShow.bind(this));
    this.pkgController.removeObserver(this);
    super.disconnectedCallback();
  }

  reset() {
    this.fetchLoading = true;
    this.fetchError = false;
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
    this.pkgController.installPkg(event.detail.pupid)
    this.requestUpdate();
  }

  handlePupClick(event) {
    this.inspectedPup = event.currentTarget.pupId
  }

  handleForcedTabShow(event) {
    this.inspectedPup = event.detail.pupId
  }

  async fetchBootstrap() {
    this.reset();
    // Emit busy start event which adds this action to a busy-queue.
    this.dispatchEvent(new CustomEvent('busy-start', {}));

    try {
      const res = await getBootstrap()
      this.pkgController.setData(res);
      this.packageList.setData(this.pkgController.packages);
    } catch (err) {
      console.error(err);
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

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'searchValue') {
        this.filterPackageList();
      }
    });
  }

  filterPackageList() {
    if (this.searchValue === "") {
      this.packageList.setFilter();
    }
    this.packageList.setFilter((pkg) => pkg?.manifest?.package?.toLowerCase()?.includes(this.searchValue.toLowerCase()));
  }

  render() {
    const ready = (
      !this.fetchLoading &&
      !this.fetchError &&
      this.packageList.data
    )

    const hasItems = (listNickname) => {
      switch(listNickname) {
        case 'packages':
          return Boolean(this.packageList.data.length)
          break;
      }
    }

    const SKELS = Array.from({ length: 1 })

    return html`

      ${this.renderSectionTop()}

      <div class="padded">
        <header>
          ${this.renderSectionHeader(ready)}
        </header>
          ${this.renderSectionBody(ready, SKELS, hasItems)}
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
      color: #ffd807;
    }

    header {
      display: flex;
      flex-direction: column;
      gap: 1em;
      @media (min-width: 576px) {
        flex-direction: row;
        align-items: baseline;
        justify-content: space-between;
        gap: 0.8rem;  
      }
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
      justify-content: space-between;
      margin-bottom:1em;
      @media (min-width: 576px) {
        margin-left: auto;
        justify-content: flex-end;
      }
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

customElements.define('store-view', StoreView);
