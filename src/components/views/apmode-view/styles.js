import { css } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export const appModeStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    margin: 0 auto;
  }

  .loader-overlay {
    height: calc(100vh - 3em);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  main {
    display: flex;
    justify-content: center;
    max-width: 576px;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  .padded {
    padding: 20px;
  }
  h1,
  p {
    font-family: "Comic Neue", sans-serif;
    text-align: center;
  }

  main .main-step-wrapper {
    margin-top: 7em;
    display: block;
    margin-left: auto;
    margin-right: auto;
    max-width: 480px;
  }

  div.coming-soon {
    display: flex;
    margin-top: 4em;
    margin-bottom: 3em;
    justify-content: center;
    align-items: center;
  }

  #MgmtDialog::part(footer) {
    border-top: 1px solid var(--sl-panel-border-color);
  }
`;

