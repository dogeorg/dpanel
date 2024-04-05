import { css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

export const styles = css`
  :host {
    opacity: 1;
    transition: opacity 500ms;
    display: block;
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
    gap: 0.5em;
    width: 100%;

    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }

  .summary .summary-section {
    display: flex;
    flex-direction: row;
    gap: 0.5em;
  }

  .summary-section.summary-section-title {
    max-width: 120px;
  }

  .summary-section.summary-section-charts {
    flex-grow: 1;
    flex-shrink: 1;
    @media (min-width: 768px) {

    }
  }

  .summary .summary-section.summary-section-actions {
    display: flex;
    flex-grow: 1;
    justify-content: end;
    gap: 0.25em;

    border-top: 1px solid var(--sl-color-neutral-200);
    padding-top: var(--sl-spacing-medium);
    @media (min-width: 768px) {
      flex-grow: 0;
      border-top: none;
      padding-top: 0;
    }
  }

  sl-tab-group::part(tabs) {
    color: tomato;
  }

  sl-tab-group::part(active-tab-indicator) {
    background-color: tomato;
  }
`