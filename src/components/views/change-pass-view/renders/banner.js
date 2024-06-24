import { html, css } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export function renderBanner() {
  const bannerStyles = css`
    .banner {
      border-radius: 16px;
      padding: 1em;
      color: white;
      background-color: var(--sl-color-pink-400);
      background-image: linear-gradient(
        to bottom right,
        var(--sl-color-pink-400),
        var(--sl-color-pink-300)
      );
      position: relative;
      overflow: hidden;
      margin-bottom: 1em;
    }
    .banner main {
      max-width: 65%;
      padding: 0.5em;
    }
    .banner main p {
      font-family: unset;
    }
    .banner aside {
      position: absolute;
      right: -60%;
      top: -25px;
      width: 100%;
      height: 120%;
    }
    .banner aside img.doge-store-bg {
      height: 100%;
      width: auto;
      transform: rotate(-4deg);
    }
    .banner h1,
    .banner h2 {
      font-family: "Comic Neue", sans-serif;
      margin: 0px;
    }
    .banner p:first-of-type {
      margin-top: 0px;
    }
  `;
  return html`
    <div class="banner">
      <main>
        <h1>Reset Pass.</h1>
        <p>Change your admin password using your current pass or seed phrase (12-words)</p>
      </main>
      <aside>
        <img class="doge-store-bg" src="/static/img/locked-box.png" />
      </aside>
    </div>
    <style>
      ${bannerStyles}
    </style>
  `;
}
