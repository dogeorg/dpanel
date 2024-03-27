import { html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

export function renderSummaryTitle() {
  return html`
    <span class="title">
      <sl-icon name="${this.icon}"></sl-icon>
      ${this.pupName}
    </span>
    <span class="tags">
      <sl-tag size="small" pill>${this.version}</sl-tag>
    </span>
    <style>${summaryTitleStyles}</style>
  `
}

const summaryTitleStyles = css`
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5em;
    text-transform: capitlize;
  }
`;