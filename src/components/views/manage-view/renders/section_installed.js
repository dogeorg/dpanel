import { html, css, nothing, repeat } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

export function renderSectionInstalledHeader(ready) {
  return html`
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
        ${repeat(this.installedList.getCurrentPageData(), (pkg) => `${pkg.package}-${pkg.version}-installed`, (pkg) => html`
          <pup-snapshot
            pupId=${pkg.package}
            pupName=${pkg.package}
            version=${pkg.version}
            status=${pkg.command.status}
            .config=${pkg.command.config}
            .docs=${pkg.docs}
            icon="box"
            ?disabled=${this.busy}
            installed>
          </pup-snapshot>
        `)
      }
      </div>
      <paginator-ui
        ?disabled=${this.busy}
        @go-next=${this.installedList.nextPage}
        @go-prev=${this.installedList.previousPage}
        currentPage=${this.installedList.currentPage}
        totalPages=${this.installedList.getTotalPages()}
      ></paginator-ui>
    ` : nothing}
  `
}