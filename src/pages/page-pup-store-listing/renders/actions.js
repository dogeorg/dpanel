import { html, css, nothing } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export function openConfig() {
  this.open_dialog = "configure";
  this.open_dialog_label = "Configure";
}

export function renderActions() {
  const pkg = this.context.store.pupContext;
  console.log(pkg);
  const styles = css`
    .action-wrap {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 1em;

      sl-button {
        min-width: 180px;
      }
    }
  `
  const isInstalled = !!pkg?.state?.status;

  return html`
    <div class="action-wrap">

      ${isInstalled ? html`
        <sl-button variant="primary" size="large" href="${pkg.computed.url.library}">
          Manage
        </sl-button>
      ` : nothing }

      ${!isInstalled ? html`
        <sl-button variant="warning" size="large">
          Such Install
        </sl-button>
      ` : nothing }

    </div>
    <style>${styles}</style>
  `
};