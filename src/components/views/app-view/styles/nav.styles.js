import { css } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export const navStyles = css`
  #Nav {
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    overflow: hidden;
  }

  #GutterNav {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    @media (min-width: 576px) {
      flex-direction: column;
      align-items: center;
      width: 49px;
    }
  }

  #GutterNav .gutter-footer {
    display: none;
    @media (min-width: 566px) {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 10px;
      align-items: center;
      justify-content: center;
      padding: 0.7em 0em;
    }
  }

  #GutterNav .gutter-body {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    column-gap: 1.4em;
    row-gap: 1.4em;

    opacity: 1;
    z-index: 2;

    /*border-right: 1px solid #1c1b22;*/
    /*background: #1c1b22;*/
    padding: 0.75em;

    height: 100%;
    width: 100%;
    overflow-y: auto;

    @media (min-width: 576px) {
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 0.75em 0em;
    }
  }

  #GutterNav[open] {
    width: 100%;
    background: #1c1b22;
    @media (min-width: 576px) {
      border-right: 1px solid var(--sl-panel-border-color);
      width: 50px;
    }
  }

  #GutterNav #logo {
    position: relative;
    top: 2px;

    background: #f9e7b5;
    border: 1px solid #f9e7b5;
    border-radius: 4px;

    height: 22px;
    // transform: rotate(-3deg);

    img {
      position: absolute;
      top: -7px;
      left: -6px;

      width: 36px;
      // transform: rotate(0deg);
    }
  }

  #GutterNav #logo:hover {
    border: 1px solid rgb(255, 208, 67);
    background: rgb(255, 208, 67);
  }

  #GutterNav #menu,
  #GutterNav .tray-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-size: 1.1rem;
  }

  #GutterNav .tray-icon {
    color: #595959;
  }

  #GutterNav #menu sl-icon {
    // transform: rotate(6deg);
  }

  #GutterNav .gutter-menu-item {
    width: 26px;
    height: 26px;
    text-align: center;
  }

  #GutterNav .gutter-menu-item.bg {
  }

  #GutterNav .gutter-menu-item:hover {
    cursor: pointer;
  }

  #GutterNav .gutter-menu-item:hover {
    background: #a2a2a2;
    border: 1px solid #a2a2a2;
  }

  #Side[open] {
    display: flex;
    position: absolute;
    top: 50px;

    flex-shrink: 0;
    overflow-y: auto;
    overflow-x: hidden;

    background: #1a191f;
    box-shadow: none;

    @media (min-width: 576px) {
      top: 0px;
      left: 50px;
      box-shadow: 10px 0 5px -5px rgba(0, 0, 0, 0.2);
    }

    @media (min-width: 1024px) {
      position: relative;
      top: 0px;
      left: 0px;
      box-shadow: none;
    }
  }

  #Side {
    display: none;
    left: 0px;
    z-index: 1;

    flex-direction: column;
    justify-content: space-between;
    row-gap: 1em;

    width: 100%;
    height: calc(100vh - 50px);
    overflow-y: auto;

    background: #1a191f;

    @media (min-width: 576px) {
      top: 0px;
      left: 50px;
      width: 240px;
      height: 100vh;
    }

    @media (min-width: 1024px) {
      width: 240px;
    }
  }

  #Side .inner.opaque {
    opacity: 0.1;
  }

  #Side .menu-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 1em;

    margin: 0.2em 0em 0.2em 0.5em;
    padding: 0.5em 1em;

    font-family: "Comic Neue";
    font-size: 1.1rem;
    font-weight: 600;
  }

  #Side .menu-item:hover,
  #Side .sub-menu-item:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  #Side .sub-menu-list {
    background: rgba(255, 255, 255, 0.02);
    margin-top: -3px;
    margin-left: 0.55em;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    column-gap: 1em;
  }

  #Side .sub-menu-list .sub-menu-item {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 1em;
    margin: 0.1em 0em 0em 0em;
    padding: 0.5em 1em 0.5em 2em;

    font-family: "Comic Neue";
    font-size: 1.1rem;
    font-weight: 600;
  }

  #Side .menu-label {
    padding: 0.5em 1.5em;
    font-family: "Comic Neue";
    font-size: 0.85rem;
    font-weight: bold;
    text-transform: uppercase;
    color: #5e74eb;
  }

  #Side .menu-item.active,
  #Side .sub-menu-item.active {
    background: #4360ff;
  }

  #Side .menu-item.active a,
  #Side .menu-item.active sl-icon,
  #Side .sub-menu-item.active a,
  #Side .sub-menu-item.active sl-icon {
    text-decoration: none;
    color: white;
  }

  #Side .menu-item a,
  #Side .sub-menu-item a {
    color: rgba(255, 255, 255, 0.5);
  }

  #Side .menu-item sl-icon,
  #Side .sub-menu-item sl-icon {
    font-size: 1.3rem;
    color: rgba(255, 255, 255, 0.5);
  }

  .nav-footer-content {
    padding: 0em var(--sl-spacing-x-large);
    padding-bottom: var(--sl-spacing-x-large);
  }

  #Side .sub-menu-list.hidden { display: none; }

  #Side .menu-item-wrap.expand {
    border-right: 3px solid rgba(255, 255, 255, 0.1);
  }
  #Side .menu-item-wrap.sub-active,
  #Side .menu-item-wrap.expand.sub-active {
    border-right: 3px solid #4360ff;
  }

  #Side .menu-item-wrap.expand .menu-item {
    background: rgba(255, 255, 255, 0.1);
  }

  #Side .menu-item-wrap .menu-item::after {
    content: "▼";
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.1);
    margin-left: -5px;
    margin-top: 2px;
  }

  #Side .menu-item-wrap.expand .menu-item::after {
    color: rgba(255, 255, 255, 0.5);
  }

  #Side .menu-item-wrap.expand .menu-item:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  #Side section.section-installed .menu-item.active {
    background: #4360ff;
  }


  /* Pulse / Prompt Mode */
  #GutterNav.pulse {
    animation-name: color;
    animation-duration: 700ms;
    animation-iteration-count: infinite;
    animation-direction: alternate-reverse;
    animation-timing-function: linear;

    .gutter-footer {
      color: white;
    }

    .gutter-footer #keys {
      background: #fd5a5a;
      border-color: #fd5a5a;
    }
  }
    @keyframes color {
      from {
        background-color: rgb(44, 77, 255);
      }
      to {
        background-color: rgb(138, 156, 255);
      }
    }

`;

