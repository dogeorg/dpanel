import { html, css, nothing, repeat } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import debounce from "/utils/debounce.js";

export function renderSectionHeader(ready) {
  return html`
    <div class="heading-wrap">
      <h2>Much Pups</h2>
      ${this.fetchLoading ? html`
        <sl-spinner></sl-spinner>
      ` : nothing }

      ${ready ? html`
        <sl-tag pill>${this.packageList.data.length}</sl-tag>
      ` : nothing }
    </div>

    <div class="header-actions">
      <sl-input
        type="search"
        @sl-input=${this.handleDebouncedSearchInput}
        value=${this.searchValue}
        clearable
      >
        <sl-icon name="search" slot="prefix"></sl-icon>
      </sl-input>
      <sl-dropdown>
        <sl-button slot="trigger" ?disabled=${this.busy}><sl-icon name="three-dots-vertical"></sl-icon></sl-button>
        <sl-menu @sl-select=${this.handleActionsMenuSelect}>
          <sl-menu-item>
            Repository
            <sl-menu slot="submenu">
              <sl-menu-item value="repository-local">Local</sl-menu-item>
              <sl-menu-item value="repository-remote-a">Remote A</sl-menu-item>
              <sl-menu-item value="repository-remote-b">Remote B</sl-menu-item>
              <sl-menu-item value="repository-remote-c">Remote C</sl-menu-item>
            </sl-menu>
          </sl-menu-item>
          <sl-menu-item value="refresh">Refresh</sl-menu-item>
        </sl-menu>
      </sl-dropdown>
    </div>
  `
}

export function renderSectionBody(ready, SKELS, hasItems) {
  return html`
    ${this.fetchLoading ? html`
      <div class="details-group">
        ${repeat(SKELS, (_, index) => index, () => html`
          <pup-snapshot-skeleton></pup-snapshot-skeleton>
        `)}
      </div>
    ` : nothing }

    ${ready && !hasItems('packages') ? html`
      <div class="empty">
        Such empty.  No pups available in this repository.
      </div>
      ` : nothing 
    }

    ${ready && hasItems('packages') ? html`
      <div class="details-group">
        ${repeat(this.packageList.getCurrentPageData(), (pkg) => `${pkg.manifest.id}-${pkg.manifest.version}`, (pkg) => html`
          <pup-snapshot
            pupId=${pkg.manifest.id}
            pupName=${pkg.manifest.package}
            version=${pkg.manifest.version}
            icon="box"
            ?installed=${pkg.state.status}
            ?markInstalled=${pkg.state.status}
            .docs=${pkg.manifest.docs}
            @click=${this.handlePupClick}
            ?inspected=${this.inspectedPup === pkg.manifest.id}
            ?disabled=${this.busy}>
          </pup-snapshot>
        `)}
      </div>
      <paginator-ui
        ?disabled=${this.busy}
        @go-next=${this.packageList.nextPage}
        @go-prev=${this.packageList.previousPage}
        currentPage=${this.packageList.currentPage}
        totalPages=${this.packageList.getTotalPages()}
      ></paginator-ui>
    ` : nothing}
  `

}

export function handleDebouncedSearchInput(e) {
  this.searchValue = e.target.value
}