import { html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

export function renderSectionTop() {
  return html`
    <sl-alert variant="warning" open closable>
      <img slot="icon" class="alert-img" src="/static/img/doge-thumb.png" />
      <div class="alert-text-wrap">
        <strong>Much Pups!</strong><br />
        Pups are software packages that you can install and run.
      </div>
    </sl-alert>
    <style>${infoAlertStyles}</style>
  `
}

const infoAlertStyles = css`
  img.alert-img {
    display: inline-block;
    margin-top: -1em;
    margin-bottom: -0.8em;
    width: 50px;
    @media (min-width: 768px) {
      width: 100px;
    }
  }
`