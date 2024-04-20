import { css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

export const styles = css`
  :host {
    display: block;
    opacity: 1;
    transition: opacity 500ms;
  }

  :host([disabled]:not([focus="true"])) {
    opacity: 0.5;
  }
  
  /* Details toggle */
  sl-details::part(summary-icon) {
    /* Disable the expand/collapse animation */
    display: none;
    rotate: none;
  }

  .summary {
    display: flex;
    flex-direction: column;
    row-gap: 0.5em;
    width: 100%;

    @media (min-width: 1024px) {
      flex-direction: row;
      column-gap: 0.5em;
      justify-content: space-between;
      align-items: center;
    }
  }

  .summary .summary-section {
    display: flex;
    flex-direction: row;
    column-gap: 0.5em;
  }

  .summary-section.summary-section-title {
    max-width: 300px;
    flex-shrink: 1;
  }

  .summary-section.summary-section-charts {
    flex-grow: 1;
    flex-shrink: 1;
  }

  .summary .summary-section.summary-section-actions {
    display: flex;
    flex-grow: 1;
    justify-content: end;
    column-gap: 0.75em;

    border-top: 1px solid var(--sl-color-neutral-200);
    padding-top: var(--sl-spacing-medium);
    @media (min-width: 1024px) {
      flex-grow: 0;
      border-top: none;
      padding-top: 0;
    }
  }

  sl-tab::part(base):hover {
    color: #07ffae;
  }

  sl-tab[active]::part(base) {
    color: #07ffae;
  }
`