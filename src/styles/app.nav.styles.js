import { css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

export const navStyles = css`
  #Nav {
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    overflow: hidden;
  }

  #GutterNav {
    display: flex;
    flex-shrink: 0;
    flex-direction: row;
    justify-content: space-between;
    column-gap: 1.4em;
    row-gap: 1.4em;
    
    opacity: 1;
    z-index: 2;

    border-right: 1px solid #1c1b22;
    background: #1c1b22;
    padding: 0.75em;    
    
    height: 100%;
    width: 100%;
    overflow-y: auto;

    @media (min-width: 576px) {
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      width:50px;
      padding: 0.75em 0em;
    }
  }

  #GutterNav[open] {
    border-right: 1px solid #282731;
    border-bottom: 1px solid var(--sl-panel-border-color);
    background: #1c1b22;
    @media (min-width: 576px) {
      border-bottom: 1px solid #282731;
      border-right: 1px solid var(--sl-panel-border-color);
    }
  }

  #GutterNav #logo {
    position: relative;
    top: 2px;
    
    background: #f9e7b5;
    border: 1px solid #f9e7b5;
    border-radius: 4px;
    
    height:22px;
    transform: rotate(-3deg);

    img {
      position:absolute;
      top:-7px;
      left: -6px;
      
      width: 36px;
      transform: rotate(0deg);
    }
  }

  #GutterNav #logo:hover {
    border: 1px solid rgb(255, 208, 67);
    background: rgb(255, 208, 67);
  }

  #GutterNav #menu {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transform: rotate(-3deg);
    font-size: 1.1rem;
  }

  #GutterNav #menu sl-icon {
    transform: rotate(6deg);
  }

  #GutterNav .gutter-menu-item {
    background: grey;
    border: 1px solid grey;
    
    width: 26px;
    height: 26px;
  }

  #GutterNav .gutter-menu-item:hover {
    background: #a2a2a2;
    border: 1px solid #a2a2a2;
    cursor: pointer;
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
    column-gap: 1em;
    
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

  #Side .menu-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1em;
    
    margin: 0.2em 0em 0.2em 0.5em;
    padding: 0.5em 1em;
    
    font-family: 'Comic Neue';
    font-size: 1.1rem;
    font-weight: 600;
  }

  #Side .menu-item:hover {
    background: rgba(255,255,255,0.1);
  }

  #Side .menu-label {
    padding: 0.5em 1.5em;
    font-family: 'Comic Neue';
    font-size: 0.85rem;
    font-weight: bold;
    text-transform: uppercase;
    color: #5e74eb;
  }

  #Side .menu-item.active {
    background: #4360ff;
  }

  #Side .menu-item.active a,
  #Side .menu-item.active sl-icon {
    text-decoration: none;
    color: white;
  }

  #Side .menu-item a {
    color: rgba(255,255,255,0.5);
  }

  #Side .menu-item sl-icon {
    font-size: 1.3rem;
    color: rgba(255,255,255,0.5);
  }

  .nav-footer-content {
    padding: 0em var(--sl-spacing-x-large);
    padding-bottom: var(--sl-spacing-x-large);
  }
`