import { html, css, nothing, repeat } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

var pupCardGrid = css`
  .pup-card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1em;
  }
`

export function renderSectionInstalledHeader(ready) {


  return html`
    <!-- div class="heading-wrap">
      ${this.fetchLoading ? html`
        <sl-spinner></sl-spinner>
      ` : nothing }

      ${ready ? html`
        <sl-tag pill>${this.installedList.data.length}</sl-tag>
      ` : nothing }
    </div -->

    <!-- div class="actions">
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
    </div -->
  `
}

export function renderSectionInstalledBody(ready, SKELS, hasItems) {
  return html`
    ${this.fetchLoading ? html`
      <div class="details-group">
        ${repeat(SKELS, (_, index) => index, () => html`
          <pup-snapshot-skeleton></pup-snapshot-skeleton>
        `)}
      </div>
    ` : nothing }

    ${ready && !hasItems('installed') ? html`
      <div class="empty">
        Such empty.  No pups available in this repository.
      </div>
      ` : nothing 
    }

    ${ready && hasItems('installed') ? html`
      <div class="pup-card-grid">
        ${repeat(this.installedList.getCurrentPageData(), (pkg) => `${pkg.manifest.id}-${pkg.manifest.version}`, (pkg) => html`
          <pup-card
            icon="box"
            pupId=${pkg.manifest.id}
            pupName=${pkg.manifest.package}
            version=${pkg.manifest.version}
            status=${pkg.state.status}
            ?hasGui=${!!pkg.manifest.gui}
          ></pup-card>
        `)}
      </div>
      <style>${pupCardGrid}</style>

      <paginator-ui
        ?disabled=${this.busy}
        @go-next=${this.installedList.nextPage}
        @go-prev=${this.installedList.previousPage}
        currentPage=${this.installedList.currentPage}
        totalPages=${this.installedList.getTotalPages()}
      ></paginator-ui>

      `: nothing
    }
  `
}