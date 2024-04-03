import { LitElement, html, css, nothing } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import '/components/views/pup-snapshot/pup-snapshot.js'
import '/components/views/pup-snapshot/pup-snapshot-skeleton.js'
import { getPackageList } from '/api/packages/packages.js';
import { PaginationController } from '/components/common/paginator/paginator-controller.js';
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
    this.installedList = new PaginationController(this, undefined, this.itemsPerPage);
    this.availableList = new PaginationController(this, undefined, this.itemsPerPage);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('busy-start', this.handleBusyStart.bind(this));
    this.addEventListener('busy-stop', this.handleBusyStop.bind(this));
    this.addEventListener('pup-installed', this.handlePupInstalled.bind(this));
    this.fetchPackageList();
  }

  disconnectedCallback() {
    this.removeEventListener('busy-start', this.handleBusyStart.bind(this));
    this.removeEventListener('busy-stop', this.handleBusyStop.bind(this));
    this.removeEventListener('pup-installed', this.handlePupInstalled.bind(this));
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

  handlePupInstalled() {
    
  }

  async fetchPackageList() {
    this.reset();
    // Emit busy start event which adds this action to a busy-queue.
    this.dispatchEvent(new CustomEvent('busy-start', {}));

    try {
      const res = await getPackageList()
      this.installedList.setData(res.local.installed)
      this.availableList.setData(res.local.available)
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
        this.fetchPackageList();
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

    const SKELS = Array.from({ length: 3 })

    return html`
      <div class="padded">

        <h1>Manage</h1>

        <header>
          <h2>Installed Pups</h2>

          ${this.fetchLoading ? html`
            <sl-spinner></sl-spinner>
          ` : nothing }

          ${ready ? html`
            <sl-tag pill>${this.installedList.data.length}</sl-tag>
          ` : nothing }

          <div class="actions">
            <sl-dropdown>
              <sl-button slot="trigger" ?disabled=${this.busy}><sl-icon name="three-dots-vertical"></sl-icon></sl-button>
              <sl-menu @sl-select=${this.handleActionsMenuSelect}>
                <sl-menu-item value="refresh">Refresh</sl-menu-item>
              </sl-menu>
            </sl-dropdown>
          </div>
        </header>

        ${this.fetchLoading ? html`
          <div class="details-group">
            ${SKELS.map(() => html`<pup-snapshot-skeleton></pup-snapshot-skeleton>`)}
          </div>
        ` : nothing }

        ${this.fetchError ? html`
          <sl-alert variant="danger" open>
            <sl-icon slot="icon" name="exclamation-octagon"></sl-icon>
            <strong>An error occurred<br />
            Sorry, the package list could not be obtained.
          </sl-alert>
          <br>
          <sl-button outline @click=${this.fetchPackageList}>Retry</sl-button>
        ` : nothing }

        ${ready && !hasItems('installed') ? html`
          <div class="empty">
            Such empty.  Try install a Pup
          </div>
          ` : nothing 
        }

        ${ready && hasItems('installed') ? html`
          <div class="details-group">
            ${this.installedList.getCurrentPageData().map(pkg => html`
              <pup-snapshot
                pupId=${pkg.package}
                pupName=${pkg.package}
                version=${pkg.version}
                status=${pkg.command.status}
                .config=${pkg.command.config}
                icon="box"
                ?disabled=${this.busy}
                installed>
              </pup-snapshot>
            `)}
          </div>
          <paginator-ui
            ?disabled=${this.busy}
            @go-next=${this.installedList.nextPage}
            @go-prev=${this.installedList.previousPage}
            currentPage=${this.installedList.currentPage}
            totalPages=${this.installedList.getTotalPages()}
          ></paginator-ui>
        ` : nothing}

        <header>
          <h2>Available Pups</h2>

          ${this.fetchLoading ? html`
            <sl-spinner></sl-spinner>
          ` : nothing }

          ${ready ? html`
            <sl-tag pill>${this.availableList.data.length}</sl-tag>
          ` : nothing }

          <div class="actions">
            <sl-dropdown>
              <sl-button slot="trigger" ?disabled=${this.busy}><sl-icon name="three-dots-vertical"></sl-icon></sl-button>
              <sl-menu @sl-select=${this.handleActionsMenuSelect}>
                <sl-menu-item value="refresh">Refresh</sl-menu-item>
              </sl-menu>
            </sl-dropdown>
          </div>
        </header>

        ${ready && !hasItems('available') ? html`
          No pups installed
          ` : nothing 
        }

        ${ready && hasItems('available') ? html`
          <div class="details-group">
            ${this.availableList.getCurrentPageData().map(pkg => html`
              <pup-snapshot
                pupId=${pkg.package}
                pupName=${pkg.package}
                version=${pkg.version}
                status="${pkg.command.status}"
                .config=${pkg.command.config}
                icon="box"
                ?disabled=${this.busy}>
              </pup-snapshot>
            `)}
          </div>
          <paginator-ui
            ?disabled=${this.busy}
            @go-next=${this.availableList.nextPage}
            @go-prev=${this.availableList.previousPage}
            currentPage=${this.availableList.currentPage}
            totalPages=${this.availableList.getTotalPages()}
          ></paginator-ui>
        ` : nothing}

      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      height: 100vh;
      width: 100%;
      overflow-y: auto;
    }
    .padded {
      padding: 0.5em;
      @media (min-width: 768px) {
        padding: 1.4em;
      }
    }

    h1, h2 {
      font-family: 'Comic Neue', sans-serif;
      color: #ffc107;
    }

    header {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.8rem;
    }

    header .actions {
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
