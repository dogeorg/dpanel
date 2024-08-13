import { LitElement, html, css, nothing, repeat } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import { getBootstrap } from '/api/bootstrap/bootstrap.js';
import { pkgController } from '/controllers/package/index.js'
import { PaginationController } from '/components/common/paginator/paginator-controller.js';
import { bindToClass } from '/utils/class-bind.js'
import * as renderMethods from './renders/index.js';
import '/components/views/card-pup-install/index.js'
import '/components/common/paginator/paginator-ui.js';
import '/components/common/page-banner.js';

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
    this.showCategories = false;
    this.categories = [
      { name: "all", label: "All" },
      { name: "meme", label: "Memes" },
      { name: "social", label: "Social" },
      { name: "transact", label: "Transact" },
      { name: "blockchain", label: "Blockchain" },
      { name: "develop", label: "Develop" },
      { name: "Write", label: "Write" },
      { name: "host", label: "Host" },
    ]
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
      <page-banner title="Dogecoin" subtitle="Registry">
        Extend your Dogebox with Pups<br/>
        <sl-button variant="text">
          <sl-icon name="arrow-left-right" slot="prefix"></sl-icon>
          Change Registry
        </sl-button>
      </page-banner>

      <div class="row search-wrap">
        <sl-input class="constrained w55" type="search" size="large" placeholder="Search">
          <sl-icon name="search" slot="prefix"></sl-icon>
        </sl-input>
      </div>

      ${this.showCategories ? html`
        <div class="tab-wrap constrained w80">
          <sl-tab-group class="cat-picker">
            ${this.categories.map((c) => html`
              <sl-tab slot="nav" ?disabled=${c.disabled} panel="${c.name}">${c.label}</sl-tab>
            `)}
          </sl-tab-group>
        </div>
      ` : nothing }

      ${this.renderSectionBody(ready, SKELS, hasItems)}

    `;
  }

  static styles = css`
    :host {
      display: block;
      padding: 20px;
    }

    div.row {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 2em;
      width: 100%;
    }

    .constrained {
      width: 100%;
      @media (min-width:576px) {
        &.w55 { width: 55% }
        &.w80 { width: 80% }
      }
    }

    .tab-wrap {
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 3em
    }

    .cat-picker {
      --indicator-color: white;
      sl-tab::part(base) { color: grey; }
      sl-tab[active]::part(base) { color: white; }
      sl-tab::part(base):hover { color: white; }
      
      margin-left: auto;
      margin-right: auto;
      position: relative;
      top: 2px;
      
    }
  `
}

customElements.define('x-page-pup-store', StoreView);
