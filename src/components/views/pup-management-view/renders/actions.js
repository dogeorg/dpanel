import { html, css } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export function renderActions() {
  const styles = css`
    .action-wrap {
      display: flex;
      flex-direction: row;
      gap: 1em;
    }
  `
  return html`
    <div class="action-wrap">
      <sl-button variant="danger" size="large">
        <sl-icon slot="prefix" name="stop-fill"></sl-icon>
        Stop
      </sl-button>
      <sl-button variant="primary" size="large">
        <sl-icon slot="prefix" name="arrow-clockwise"></sl-icon>
        Restart
      </sl-button>
    </div>
    <style>${styles}</style>
  `
};