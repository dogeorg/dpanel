import { html, css } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export function renderStatus() {
  const styles = css`
    .status-label {
      font-size: 2em;
      line-height: 1.5;
      display: block;
      padding-bottom: 0.5rem;
      font-family: 'Comic Neue';

      &.running {
        color: #2ede75;
      }
    }
  `
  return html`
    <span class="status-label running">Running</span>
    <style>${styles}</style>
  `
};