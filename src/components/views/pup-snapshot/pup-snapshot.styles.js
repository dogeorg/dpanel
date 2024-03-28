import { css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

export const styles = css`
  :host {
    display: block;
  }
  
  /* Details toggle */
  sl-details::part(summary-icon) {
    /* Disable the expand/collapse animation */
    display: none;
    rotate: none;
  }

  .summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .summary > div {
    display: flex;
    flex-direction: row;
    gap: 0.5em;
  }

  .summary div.center {
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  .summary > div:last-of-type {
    display: flex;
    justify-content: end;
    gap: 0.25em;
  }
`