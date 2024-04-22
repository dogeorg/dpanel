import { css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

export const styles = css`
  form {
    padding: 0em 1em;
  }

  /* Form tabs */
  sl-tab.capitalize::part(base) {
    text-transform: capitalize;
  }

  /* Form element spacing */
  .form-control {
    margin-bottom: 1.5em;
  }

  /* Highlighting edits */
  [data-dirty-field] {
    position: relative;
  }
  [data-dirty-field]::part(form-control-label)::before,
  [data-dirty-field]::part(label)::before {
    content: "~";
    color: var(--sl-color-neutral-500);
    display: inline-block;
    position: absolute;
    left: -1em;
  }

  .tag-change-indicator {
    margin-left: 0.5em;
  }

  /* Footer buttons (submit, discard etc) */
  .footer-controls {
    display: flex;
    justify-content: flex-end;
  }

  .footer-controls sl-button.discard-button::part(base) {
    color: var(--sl-color-neutral-700);
    text-decoration: underline;
  }
  .footer-controls sl-button.discard-button::part(base):hover {
    color: var(--sl-color-neutral-900);
  }
`;