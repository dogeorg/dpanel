import { html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

export function renderSectionTop() {
  return html`
    <div class="padded banner">
      <main>
        <h1>Such find!</h1>
        <p>Find Pups made by the community. <br/>Pups are software packages (services and applications) that run on Dogebox, interact with the network, blockchain and community.</p>
        <sl-button outline variant="secondary">Much wow</sl-button>
      </main>
      <aside>
        <img class="doge-store-bg" src="/static/img/store-cart.png" />
      </aside>
    </div>
    <style>${bannerStyles}</style>
  `
}

const bannerStyles = css`
  .banner,
  .padded.banner {
    color: white;
    background-color: var(--sl-color-indigo-400);
    background-image: linear-gradient(to bottom right, var(--sl-color-indigo-400), var(--sl-color-indigo-300));
    position: relative;
    overflow: hidden;
  }
  .banner main {
    max-width: 60%;
    padding: 0.5em;
  }

  .banner main p {
    font-family: unset;
  }
  .banner aside {
    position: absolute;
    right: -68%;
    top: -35px;
    width: 100%;
    height: 128%;

    @media (min-width: 768px) {
      top: -65px;
      height: 160%;
    }

    @media (min-width: 1024px) {
      right: -55%;
      top: -105px;
      height: 180%;
    }
  }
  .banner aside img.doge-store-bg {
    height: 100%;
    width: auto;
    transform: rotate(-4deg);
  }

  .banner h1,
  .banner h2 {
    color: white;
    font-family: 'Comic Neue', sans-serif;
    margin: 0.4em 0em 0em;
  }
  .banner p:first-of-type {
    margin-top: 0px;
  }
`