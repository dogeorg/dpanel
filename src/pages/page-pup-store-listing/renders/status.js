import { html, css, classMap, nothing } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export function renderStatus() {
  const pkg = this.pkgController.getPup(this.context.store.pupContext.manifest.id);
  const { statusId, statusLabel } = pkg.computed
  const isLoadingStatus = ["installing"].includes(statusId);
  const styles = css`
    .status-label {
      font-size: 2em;
      line-height: 1.5;
      display: block;
      padding-bottom: 0.5rem;
      font-family: 'Comic Neue';
      text-transform: capitalize;
    }
  `

  return html`
    <span class="status-label">${pkg.manifest.package}</span>
    <style>${styles}</style>
  `
};