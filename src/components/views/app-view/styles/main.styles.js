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

  /* FORWARD NAVIGATION */
  #Outlet > .leaving { 
      animation: 250ms fadeOut ease-in-out; 
  }
  #Outlet > .entering { 
      animation: 250ms slideFadeIn ease; 
  }

  /* BACKWARD NAVIGATION */
  #Main.backward #Outlet > .leaving {
    animation: none;
  }
  #Main.backward #Outlet > .entering { 
    animation: none;
  }

  @keyframes slideFadeIn {
  0% {
    opacity: 1;
    transform: translateY(15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideFadeOut {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0.7;
    transform: translateY(25px);
  }
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.7;
  }
}

@keyframes stationary {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}


`