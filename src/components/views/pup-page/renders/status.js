import { html, css, classMap } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export function renderStatus() {
  const pkg = this.context.store.pupContext
  const styles = css`
    .status-label {
      font-size: 2em;
      line-height: 1.5;
      display: block;
      padding-bottom: 0.5rem;
      font-family: 'Comic Neue';
      text-transform: capitalize;

      &.running {
        color: #2ede75;
      }

      &.needs_config {
        color: var(--sl-color-amber-600);
      }
    }
  `

  const status = 'NEEDS_CONFIG' || pkg.state.status;
  const statusLabel = {
    'RUNNING': 'running',
    'NEEDS_CONFIG': 'needs config'
  }

  const statusClasses = classMap({
    'running': status === 'RUNNING',
    'needs_config': status === 'NEEDS_CONFIG',
  });

  return html`
    <span class="status-label ${statusClasses}">${statusLabel[status]}</span>
    <style>${styles}</style>
  `
};