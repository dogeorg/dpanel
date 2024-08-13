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
    }
  `

  return html`
    <span class="status-label">${pkg.manifest.package}</span>
    <style>${styles}</style>
  `
};