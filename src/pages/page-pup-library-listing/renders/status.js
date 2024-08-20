import { html, css, classMap, nothing } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export function renderStatus() {
  const pkg = this.pkgController.getPup(this.context.store.pupContext.manifest.id);
  const { statusId, statusLabel } = pkg.computed;
  const isLoadingStatus = ["starting", "stopping", "crashing"].includes(statusId);
  const styles = css`
    :host {
      --color-neutral: #8e8e9a;
    }

    .status-label {
      font-size: 2em;
      line-height: 1.5;
      display: block;
      padding-bottom: 0.5rem;
      font-family: 'Comic Neue';
      text-transform: capitalize;
      color: var(--color-neutral);

      &.running {
        color: var(--sl-color-success-500);
      }

      &.needs_config {
        color: var(--sl-color-amber-600);
      }

      &.starting,
      &.stopping
      &.stopped {
        color: var(--color-neutral);
      }

      &.broken {
        color: var(--sl-color-danger-500);
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
