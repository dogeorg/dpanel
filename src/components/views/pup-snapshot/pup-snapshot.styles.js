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
    gap: 1em;
    width: 100%;

    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }

  .summary > div {
    display: flex;
    flex-direction: row;
    gap: 0.5em;
  }

  .summary div.center {
    display: flex;
    justify-content: space-between;
    @media (min-width: 768px) {
      justify-content: center;
      gap: 10px;
    }
  }

  .summary div.right {
    border-top: 1px solid var(--sl-color-neutral-200);
    padding-top: var(--sl-spacing-medium);
    @media (min-width: 768px) {
      border-top: none;
      padding-top: 0;
    }
  }

  .summary > div:last-of-type {
    display: flex;
    justify-content: end;
    gap: 0.25em;
  }

  sl-tab-group::part(tabs) {
    color: tomato;
  }

  sl-tab-group::part(active-tab-indicator) {
    background-color: tomato;
  }
`