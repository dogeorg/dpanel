import { html, css, nothing, repeat } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

export function renderSectionAvailableHeader(ready) {
  return html`
    <div class="heading-wrap">
      <h2>Available Pups</h2>
      ${this.fetchLoading ? html`
        <sl-spinner></sl-spinner>
      ` : nothing }

      ${ready ? html`
        <sl-tag pill>${this.availableList.data.length}</sl-tag>
      ` : nothing }
    </div>

    <div class="actions">
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

export function renderSectionAvailableBody(ready, SKELS, hasItems) {
  return html`
    ${this.fetchLoading ? html`
      <div class="details-group">
        ${repeat(SKELS, (_, index) => index, () => html`
          <pup-snapshot-skeleton></pup-snapshot-skeleton>
        `)}
      </div>
    ` : nothing }

    ${ready && !hasItems('available') ? html`
      <div class="empty">
        Such empty.  No pups available in this repository.
      </div>
      ` : nothing 
    }

    ${ready && hasItems('available') ? html`
      <div class="details-group">
        ${repeat(this.availableList.getCurrentPageData(), (pkg) => `${pkg.manifest.package}-${pkg.manifest.version}`, (pkg) => html`
          <pup-snapshot
            pupId=${pkg.manifest.package}
            pupName=${pkg.manifest.package}
            version=${pkg.manifest.version}
            icon="box"
            .docs=${pkg.manifest.docs}
            @click=${this.handlePupClick}
            ?inspected=${this.inspectedPup === pkg.manifest.package}
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
  `
}