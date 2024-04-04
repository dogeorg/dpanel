import { html, css, nothing, repeat } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

export function renderSectionAvailableHeader(ready) {

  return html`
    <h2>Available Pups</h2>
    ${this.fetchLoading ? html`
      <sl-spinner></sl-spinner>
    ` : nothing }

    ${ready ? html`
      <sl-tag pill>${this.availableList.data.length}</sl-tag>
    ` : nothing }

    <div class="actions">
      <sl-select placeholder="Select repository" value="local" hoist style="max-width:200px;">
        <sl-icon name="hdd-network" slot="prefix"></sl-icon>
        <sl-option value="local">Local</sl-option>
        <sl-option value="remote-a" disabled>Remote A</sl-option>
        <sl-option value="remote-b" disabled>Remote B</sl-option>
        <sl-option value="remote-b" disabled>Remote C</sl-option>
      </sl-select>
      <sl-dropdown>
        <sl-button slot="trigger" ?disabled=${this.busy}><sl-icon name="three-dots-vertical"></sl-icon></sl-button>
        <sl-menu @sl-select=${this.handleActionsMenuSelect}>
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
        ${repeat(this.availableList.getCurrentPageData(), (pkg) => `${pkg.package}-${pkg.version}`, (pkg) => html`
          <pup-snapshot
            pupId=${pkg.package}
            pupName=${pkg.package}
            version=${pkg.version}
            status="${pkg.command.status}"
            .config=${pkg.command.config}
            icon="box"
            .docs=${pkg.docs}
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