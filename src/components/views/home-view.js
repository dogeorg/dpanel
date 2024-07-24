import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

class HomeView extends LitElement {

  static styles = css`
    :host {
      display: block;
      min-width: 980px;
      height: 100vh;
      overflow-y: auto;
    }
    .padded {
      padding: 20px;
    }
    h1, h2, h3 {
      font-family: 'Comic Neue', sans-serif;
    }
    .row {
      box-sizing: border-box;
      display: block;
      width: 100%;
    }

    .row.inset {
      background: #0B0B0B;
    }

    .flex-spacebetween {
      display: flex;
      justify-content: space-between;
    }

    .flex-alignend {
      display: flex;
      align-items: end;
    }

    .collapse-headings h1, h2, h3 {
      margin-bottom: 0px;
    }

    sl-carousel {
      --aspect-ratio: 4 / 5;
    }

    sl-details.custom-icons::part(summary-icon) {
      /* Disable the expand/collapse animation */
      rotate: none;
    }
  `

  render() {
    return html`
      <div class="padded" style="max-width:420px;">
        <sl-details class="custom-icons" summary="Dogebox online and running.">
          <sl-icon name="plus-square" slot="expand-icon"></sl-icon>
          <sl-icon name="dash-square" slot="collapse-icon"></sl-icon>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
          aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.<br><br>
          <a href="/stats">View Stats</a>
        </sl-details>
      </div>

      <div class="padded flex-spacebetween flex-alignend collapse-headings">
        <h2>Your Pups</h2>
        <a href="/pups">View All</a>
      </div>

      <div class="row inset padded">
        <sl-carousel navigation mouse-dragging slides-per-page="3" slides-per-move="1">
          <sl-carousel-item style="background: var(--sl-color-violet-200);">Slide 6</sl-carousel-item>
          <sl-carousel-item style="background: var(--sl-color-blue-200);">Slide 5</sl-carousel-item>
          <sl-carousel-item style="background: var(--sl-color-green-200);">Slide 4</sl-carousel-item>
          <sl-carousel-item style="background: var(--sl-color-yellow-200);">Slide 3</sl-carousel-item>
          <sl-carousel-item style="background: var(--sl-color-orange-200);">Slide 2</sl-carousel-item>
          <sl-carousel-item style="background: var(--sl-color-red-200);">Slide 1</sl-carousel-item>
        </sl-carousel>
      </div>

      <div class="padded flex-spacebetween flex-alignend collapse-headings">
        <h2>Community News</h2>
      </div>

      <div class="row inset padded">
        <sl-carousel navigation mouse-dragging slides-per-page="3" slides-per-move="1">
          <sl-carousel-item style="background: var(--sl-color-red-200);">Slide 1</sl-carousel-item>
          <sl-carousel-item style="background: var(--sl-color-orange-200);">Slide 2</sl-carousel-item>
          <sl-carousel-item style="background: var(--sl-color-yellow-200);">Slide 3</sl-carousel-item>
          <sl-carousel-item style="background: var(--sl-color-green-200);">Slide 4</sl-carousel-item>
          <sl-carousel-item style="background: var(--sl-color-blue-200);">Slide 5</sl-carousel-item>
          <sl-carousel-item style="background: var(--sl-color-violet-200);">Slide 6</sl-carousel-item>
        </sl-carousel>
      </div>

    `;
  }
}

customElements.define('home-view', HomeView);