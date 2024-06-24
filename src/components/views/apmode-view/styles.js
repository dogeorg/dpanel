import { css } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export const appModeStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    margin: 0 auto;
  }

  main {
    display: flex;
    justify-content: center;
    margin-top: 5em;
  }

  nav {
    padding: 1em;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
    position: fixed;
    top: 0px;
    width: 100%;
    z-index: 99;
  }
`