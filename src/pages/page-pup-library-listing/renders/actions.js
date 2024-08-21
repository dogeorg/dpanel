import { html, css, nothing } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export function openConfig() {
  this.open_dialog = "configure";
  this.open_dialog_label = "Configure";
}

export function openDeps() {
  this.open_dialog = "deps";
  this.open_dialog_label = "Dependencies";
}

export function renderActions() {
  const pkg = this.pkgController.getPup(this.context.store.pupContext.manifest.id);
  const { installationId, statusId, statusLabel } = pkg.computed
  const hasButtons =  ["needs_deps", "needs_config"].includes(statusId) || pkg.manifest.gui;
  const styles = css`
    .action-wrap {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 1em;

      &.margin {
        margin-top: 1.2em;
      }
    }

    .show-only-wide {
      display: none;
      @media (min-width: 800px) {
        display: inline-block;
      }
    }
  `

  return html`
    <div class="action-wrap ${hasButtons ? "margin" : ""}">

      ${statusId === 'needs_config' ? html`
        <sl-button variant="warning" size="large" @click=${this.openConfig}>
          <sl-icon slot="prefix" name="gear"></sl-icon>
          Configure
        </sl-button>
      ` : nothing }

      ${statusId === 'needs_deps' ? html`
        <sl-button variant="warning" size="large" name="deps" label="dependencies" @click=${this.openDeps}>
          View List
        </sl-button>
      ` : nothing }

      ${pkg.manifest.gui ? html`
        <div style="display: flex; align-items: center;">
          ${statusId === 'needs_config' || statusId === 'needs_deps' ? html`
          <sl-divider class="show-only-wide" vertical style="height: 1.5em; margin-left: 0.1em;"></sl-divider>
          `: nothing}
          <sl-button size="large" variant="warning" href="${pkg.computed.url.gui}"} ?disabled="${installationId !== "ready" }">
            <sl-icon slot="prefix" name="stars"></sl-icon>
            Launch UI
          </sl-button>
        </div>
      ` : nothing }

    </div>
    <style>${styles}</style>
  `
};
