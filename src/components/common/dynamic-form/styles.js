import { css } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export const styles = css`
  form {
    padding: 0em 0.5em;
  }
  form[data-mark-modified] {
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

  .form-control.no-margin {
    margin-bottom: 0em;
  }

  /* Highlighting edits */
  form[data-mark-modified] [data-dirty-field] {
    position: relative;
  }
  form[data-mark-modified] [data-dirty-field]::part(form-control-label)::before,
  form[data-mark-modified] [data-dirty-field]::part(label)::before {
    content: "~";
    color: var(--sl-color-neutral-500);
    display: inline-block;
    position: absolute;
    left: -1em;
  }

  .tag-change-indicator {
    margin-left: 0.5em;
    display: none;
  }
  .tag-change-indicator[data-active] {
    display: inline-block;
  }

  @media (min-width: 680px) {
    .tag-change-indicator {
      display: inline-block;
      visibility: hidden;
    }
    .tag-change-indicator[data-active] {
      display: inline-block;
      visibility: visible;
    }
  }

  /* Footer buttons (submit, discard etc) */
  .footer-controls {
    display: flex;
    justify-content: var(--submit-btn-anchor, flex-end);
  }

  .footer-controls sl-button.discard-button::part(base) {
    color: var(--sl-color-neutral-700);
    text-decoration: underline;
  }
  .footer-controls sl-button.discard-button::part(base):hover {
    color: var(--sl-color-neutral-900);
  }

  /* Wider buttons on small screens unless overriden */
  sl-button {
    width: var(--submit-btn-width, 100%);
  }
  @media (min-width: 480px) {
    sl-button {
      width: var(--submit-btn-width, auto);
    }
  }

  /* PINK THEME */
  sl-button.pink[variant="text"]::part(label) {
    color: #e64e8f;
  }
  sl-button.pink:not([variant="text"])::part(base) {
    background-color: #e64e8f;
    border-color: #e64e8f;
  }
  sl-button.pink:not([disabled], variant="text")::part(base):hover {
    background-color: #bd3c73;
    border-color: #e64e8f;
  }
`;
