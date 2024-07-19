import { css } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export const navStyles = css`
  #Nav {
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    overflow: hidden;
  }

  .logo {
    margin: 1em auto;
    width: 120px;
    display: flex;
    align-self: center;
  }

  .logotext {
    font-family: 'Comic Neue';
    text-align: center;
    font-size: 2rem;
    margin-top: -1rem;
    user-select: none;
  }

  #Side[open] {
    display: flex;
    position: absolute;

    flex-shrink: 0;
    overflow-y: auto;
    overflow-x: hidden;

    background: #181818;
    box-shadow: none;

    @media (min-width: 576px) {
      top: 0px;
      box-shadow: 10px 0 5px -5px rgba(0, 0, 0, 0.2);
    }

    /*@media (min-width: 1024px) {*/
    @media (min-width: 0px) {
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
      /* left: 50px; */
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

  #Side .inner {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  #Side .menu-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 1em;

    margin: 0.2em 0em 0.2em 0.5em;
    padding: 0.5em 1em;

    font-family: "Comic Neue";
    font-size: 1.3rem;
    font-weight: 600;

    cursor: pointer;
  }

  #Side .menu-item a,
  #Side .menu-item sl-icon {
    text-decoration: none;
    user-select: none;
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

  .nav-footer .connection {
    display: flex;
    flex-direction: row;
    padding: 0.3em 1em;
    background: #2ede75;
    gap: 0.5em;
    align-items: baseline;
    color: black;

    sl-icon {
      position: relative;
      top: 4px;
      font-size: 1.2rem;
    }
  }
`;

