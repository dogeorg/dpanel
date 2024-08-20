import { html, css, nothing } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export function openConfig() {
  this.open_dialog = "configure";
  this.open_dialog_label = "Configure";
}

export function renderActions() {
  const pkg = this.pkgController.getPup(this.context.store.pupContext.manifest.id);
  const { statusId, statusLabel } = pkg.computed
  const styles = css`
    .action-wrap {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 1em;
      margin-top: 1.2em;
    }

    .show-only-wide {
      display: none;
      @media (min-width: 800px) {
        display: inline-block;
      }
    }
  `
  const status = statusId;

  return html`
    <div class="action-wrap">

      ${statusId === 'needs_config' ? html`
        <sl-button variant="warning" size="large" @click=${this.openConfig}>
          <sl-icon slot="prefix" name="gear"></sl-icon>
          Configure
        </sl-button>
      ` : nothing }

      ${status === 'running' ? html`
        <sl-button variant="danger" size="large">
          <sl-icon slot="prefix" name="stop-fill"></sl-icon>
          Disable
        </sl-button>
      ` : nothing }

      ${status === 'starting' ? html`
        <sl-button variant="success" size="large" disabled>
          <sl-icon slot="prefix" name="play-fill"></sl-icon>
          Enable
        </sl-button>
      ` : nothing }

      ${status === 'stopping' ? html`
        <sl-button variant="danger" size="large" disabled>
          <sl-icon slot="prefix" name="stop-fill"></sl-icon>
          Disable
        </sl-button>
      ` : nothing }

      ${status === 'stopped' ? html`
        <sl-button variant="success" size="large">
          <sl-icon slot="prefix" name="play-fill"></sl-icon>
          Enable
        </sl-button>
      ` : nothing }

      ${pkg.manifest.gui ? html`
        <div style="display: flex; align-items: center;">
          <sl-divider class="show-only-wide" vertical style="height: 1.5em; margin-left: 0.1em;"></sl-divider>
          <sl-button variant="primary" size="large" outline href="/explore/${pkg.manifest.id.toLowerCase()}/ui" ?disabled=${status === "NEEDS_CONFIG"}>
            <sl-icon slot="prefix" name="box-arrow-up-right"></sl-icon>
            Launch UI
          </sl-button>
        </div>
      ` : nothing }

    </div>
    <style>${styles}</style>
  `
};
