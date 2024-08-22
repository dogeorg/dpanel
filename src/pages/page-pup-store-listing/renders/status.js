import { html, css, classMap, nothing } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export function renderStatus() {
  const pkg = this.pkgController.getPup(this.context.store.pupContext.manifest.id);
  const { installationId, installationLabel } = pkg.computed
  const isLoadingStatus = ["installing"].includes(installationId);
  const normalisedLabel = () => {
    if (["not_installed", "uninstalled"].includes(installationId)) {
      return "Not installed"
    } else {
      return installationLabel
    }
  }

  return html`
    <div class="section-title">
      <h3 class="installation-label ${installationId}">${normalisedLabel()}</h3>
    </div>
    <div>
      <span class="status-label">${pkg.manifest.package}</span>
      <sl-progress-bar class="loading-bar" value="0" ?indeterminate=${isLoadingStatus}></sl-progress-bar>
    </div>
    <style>${styles}</style>
  `
};

const styles = css`
  .status-label {
    font-size: 2em;
    line-height: 1.5;
    display: block;
    padding-bottom: 0.5rem;
    font-family: 'Comic Neue';
    text-transform: capitalize;
  }

  .loading-bar {
    --indicator-color:var(--sl-color-amber-700);
    --height: 1px;
  }

  .wrapper section.status .section-title h3 {
    font-weight: 100;
    color: var(--sl-color-warning-700);

    &.installing { color: var(--sl-color-warning-700); }
    &.installed { color: rgb(0, 195, 255); }
    &.broken { color: #fe5c5c; }
  }

  .wrapper.installed section.status .section-title h3 {
    color: #00c3ff;
  }
`
