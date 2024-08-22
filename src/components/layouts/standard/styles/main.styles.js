import { css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

export const mainStyles = css`
  *, *::before, *::after {
    box-sizing: border-box;
  }
  :host {
    display: block;
    overflow: hidden;
  }
  @font-face {
    font-family: 'Comic Neue';
    src: url('../../vendor/@gfont/Comic_Neue/ComicNeue-Regular.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  #Main {
    flex-grow: 1;
    
    height: calc(100% - 50px);
    width: 100%;
    overflow: hidden;
    margin-left: var(--page-margin-left);

    background: #23252a;
    
    @media (min-width: 576px) {
      height: 100%;
      width: calc(100% - var(--page-margin-left));
    }

    &.fullscreen {
      margin-left: 0;
      width: 100%;
    }
  }

  #Main.opaque {
    opacity: 1;
  }

  #Outlet {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: #23252a;
  }
`