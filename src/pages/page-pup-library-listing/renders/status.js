import { html, css, classMap, nothing } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export function renderStatus() {
  const pkg = this.pkgController.getPup(this.context.store.pupContext.manifest.id);
  const { statusId, statusLabel } = pkg.computed;
  const isLoadingStatus = ["starting", "stopping", "crashing"].includes(statusId);
  const styles = css`
    .status-label {
      font-size: 2em;
      line-height: 1.5;
      display: block;
      padding-bottom: 0.5rem;
      font-family: 'Comic Neue';
      text-transform: capitalize;

      &.enabled {
        color: #2ede75;
      }

      &.needs_config {
        color: var(--sl-color-amber-600);
      }

      &.installing,
      &.starting {
        color: rgb(0, 195, 255);
      }

      &.stopping,
      &.broken {
        color: #fe5c5c;
      }

      &.disabled,
      &.not_installed {
        color: #8e8e9a;
      }
    }
  `

  return html`
    <span class="status-label ${statusId}">
      ${statusLabel}
    </span>
    <style>${styles}</style>
  `
};