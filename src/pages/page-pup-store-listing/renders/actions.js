import { html, css, nothing } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export function openConfig() {
  this.open_dialog = "configure";
  this.open_dialog_label = "Configure";
}

export function renderActions() {
  const pkg = this.pkgController.getPup(this.context.store.pupContext.manifest.id);
  const { statusId, statusLabel, installationId, installationLabel } = pkg.computed
  const styles = css`
    .action-wrap {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 1em;
      margin-top: 1.2em;

      sl-button {
        min-width: 180px;
      }
    }
  `
  const isInstalled = !!pkg?.state?.status;

  return html`
    <div class="action-wrap">

      ${installationId === "not_installed" ? html`
        <sl-button variant="warning" size="large">
          Such Install
        </sl-button>
      ` : nothing }

      ${installationId === "installing" ? html`
        <sl-button variant="warning" size="large" disabled>
          Installing <sl-spinner slot="suffix" style="--indicator-color:#222"></sl-spinner>
        </sl-button>
      ` : nothing }

      ${installationId === "installed" ? html`
        <sl-button variant="primary" size="large" href="${pkg.computed.url.library}">
          Manage
        </sl-button>
      ` : nothing }

    </div>
    <style>${styles}</style>
  `
};