import { html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

export function renderSummaryTitle() {
  return html`
    <span class="title">
      <sl-icon name="${this.icon}"></sl-icon>
      ${this.pupName}
    </span>
    <span class="tags" ?hidden=${!this.version}>
      <sl-tag size="small" pill>${this.version}</sl-tag>
    </span>
    <span class="fade-tags ${this.dirty ? 'visible' : ''}">
      <sl-tag size="small" pill variant="warning">Unsaved Changed</sl-tag>
    </span>
    <style>${summaryTitleStyles}</style>
  `;
}

const summaryTitleStyles = css`
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 0.8em;
    text-transform: capitalize;
    opacity: 1;
  }
  .fade-tags {
    transition: opacity 300ms ease-in-out, visibility 300ms ease-in-out;
    opacity: 0;
    visibility: hidden;
  }
  .fade-tags.visible {
    opacity: 1;
    visibility: visible;
  }
`;