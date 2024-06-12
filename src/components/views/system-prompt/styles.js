import { css } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export const promptStyles = css`
  :host {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 9999;
    background: rgba(13, 32, 134, 0.6);
    animation: fadeIn 0.3s ease-out forwards;
  }

  :host([open]) {
    display: block;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes slideIn {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  @keyframes slideOut {
    from { transform: translateY(0); }
    to { transform: translateY(100%); }
  }

  @media (min-width: 576px) {
    @keyframes slideIn {
      from { transform: translateX(-100%); }
      to { transform: translateX(0); }
    }

    @keyframes slideOut {
      from { transform: translateX(0); }
      to { transform: translateX(-100%); }
    }
  }

  .outer {
    display: flex;
    position: absolute;
    height: 100%;
    width: 100%;
    overflow: hidden;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    animation: fadeIn 0.5s ease-out forwards;
  }

  .inner {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: auto;
    background: #4360ff;
    gap: 1em;
    margin-top: 64px;
    padding-bottom: 2em;
    transform: translateX(-100%);

    animation: slideIn 350ms ease-out forwards;
    animation-delay: 200ms;
  }

  @media (min-width: 576px) {
    .inner {
      height: 70vh;
      flex-direction: row;
      margin-top: 0;
    }

    .heading-container img,
    .review-container {
      width: 100%;
    }
  }

  .heading-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: -40px;
    margin-bottom: -25px;
  }

  .heading-container img {
    width: 100px;
  }

  @media (min-width: 576px) {
    .heading-container {
      margin-top: 0;
      img {
        width: 300px;
      }
    }
  }

  .content-container {
    height: calc(100vh - 119px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
  }

  @media (min-width: 576px) {
    .content-container {
      height: 100%;
    }
  }

  .message-container {
    padding: 0 1em;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;

    .title { line-height: 1.3; }
  }

  @media (min-width: 576px) {
    .message-container {
      flex-grow: 1;
      padding-right: 4em;
    }
  }

  .review-container {
    background: rgba(0, 0, 0, 0.2);
    overflow-x: hidden;
    margin-bottom: 1.5em;
    box-sizing: border-box;
    padding: 1em;
    font-family: courier;
    width: 100%;
  }

  .review-element {
    margin-bottom: 1em;
    overflow-x: hidden;
    span.val {
      background: rgba(0, 0, 0, 0.2);
      display: block;
      overflow-x: auto;
    }
  }

  .label-wrap {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .copy {
    display: inline-block;
    font-size: 0.9rem;
    text-align: right;
    cursor: pointer;
    color: #00c3ff;
    text-decoration: underline;
  }

  .button-container {
    display: flex;
    gap: 1em;
    width: 100%;
    justify-content: center;
    align-items: center;
    color: var(--sl-color-warning-600);
  }

  hr {
    border-bottom: 1px dashed rgba(255, 255, 255, 0.7);
    border-top: none;
  }
  .more-container {
    margin-top: 1em;
    a { color: rgba(255,255,255,0.7); }
    sl-icon { position: relative; top: 2px; left:4px; }
  }
  .more-container { display: none; }
  .more-container.mobile { display: block; }

  @media (min-width: 576px) {
    .more-container { display: block; }
    .more-container.mobile { display: none; }
  }
`