import { html, css, nothing, repeat } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

export function renderSectionInstalledHeader(ready) {
  return html`
    <div class="heading-wrap">
      <h2>Configure Pups</h2>
      ${this.fetchLoading ? html`
        <sl-spinner></sl-spinner>
      ` : nothing }

      ${ready ? html`
        <sl-tag pill>${this.installedList.data.length}</sl-tag>
      ` : nothing }
    </div>

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
      <sl-button outline @click=${this.fetchBootstrap}>Retry</sl-button>
    ` : nothing }

    ${ready && !hasItems('installed') ? html`
      <div class="empty">
        Such empty.  Try install a Pup
      </div>
      ` : nothing 
    }

    ${ready && hasItems('installed') ? html`
      <div class="details-group">
        ${repeat(this.installedList.getCurrentPageData(), (pkg) => `${pkg.manifest.id}-${pkg.manifest.version}-installed`, (pkg) => html`
          <pup-snapshot
            pupId=${pkg.manifest.id}
            pupName=${pkg.manifest.package}
            version=${pkg.manifest.version}
            .config=${pkg.manifest.command.config}
            .docs=${pkg.manifest.docs}
            status=${pkg.state.status}
            .options=${pkg.state.config}
            ?disabled=${this.busy}
            @click=${this.handlePupClick}
            ?inspected=${this.inspectedPup === pkg.manifest.id}
            icon="box"
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