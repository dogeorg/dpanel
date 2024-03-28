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
    packageList: { type: Array }
  }

  constructor() {
    super();
    this.fetchLoading = true;
    this.fetchError = false;
    this.itemsPerPage = 5;
    this.pc = new PaginationController(this, undefined, this.itemsPerPage);
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchPackageList();
  }

  reset() {
    this.fetchLoading = true;
    this.fetchError = false;
    this.packageList = null;
  }

  async fetchPackageList() {

    this.reset();

    try {
      this.pc.setData(await getPackageList())
    } catch (err) {
      this.fetchError = true;
    } finally {
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
      this.pc.data
    )

    const skeletons = Array.from({ length: this.itemsPerPage })

    return html`
      <div class="padded">

        <h1>Manage</h1>

        <header>
          <h2>Installed Pups</h2>

          ${this.fetchLoading ? html`
            <sl-spinner></sl-spinner>
          ` : nothing }

          ${ready ? html`
            <sl-tag pill>${this.pc.data.length}</sl-tag>
          ` : nothing }

          <div class="actions">
            <sl-dropdown>
              <sl-button slot="trigger"><sl-icon name="three-dots-vertical"></sl-icon></sl-button>
              <sl-menu @sl-select=${this.handleActionsMenuSelect}>
                <sl-menu-item value="refresh">Refresh</sl-menu-item>
              </sl-menu>
            </sl-dropdown>
          </div>
        </header>

        ${this.fetchLoading ? html`
          <div class="details-group">
            ${skeletons.map(() => html`<pup-snapshot-skeleton></pup-snapshot-skeleton>`)}
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

        ${ready ? html`
          <div class="details-group">
            ${this.pc.getCurrentPageData().map(pkg => html`
              <pup-snapshot
                pupId=${pkg.package}
                pupName=${pkg.package}
                version=${pkg.version}
                status=${pkg.command.status}
                icon="box">
              </pup-snapshot>
            `)}
          </div>
          <paginator-ui
            @go-next=${this.pc.nextPage}
            @go-prev=${this.pc.previousPage}
            currentPage=${this.pc.currentPage}
            totalPages=${this.pc.getTotalPages()}
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
      padding: 20px;
    }

    h1, h2 {
      font-family: 'Comic Neue', sans-serif;
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
  `
}

customElements.define('manage-view', ManageView);
