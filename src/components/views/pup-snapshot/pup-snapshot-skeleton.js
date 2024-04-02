import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

class PupSnapshotSkeleton extends LitElement {

  static styles = css`
    :host {
      display: block;
    }
    .wrap {
      width: 100%;
      box-sizing: border-box;
      display: block;
      border: solid 1px var(--sl-color-neutral-200);
      padding: 20px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }

    sl-skeleton.icon {
      width: 30px;
      height: 30px;
      flex-shrink: 0;
    }

    sl-skeleton.version {
      width: 140px;
      height: 30px;
    }

    sl-skeleton.stats {
      display: none;
      @media (min-width: 768px) {
        display: flex;
        width: auto;
        height: 30px;
        flex-grow: 1;  
      }
    }

    sl-skeleton.actions {
      width: 80px;
      height: 40px;
      border-radius: 0;
      --border-radius: 0;
    }
  `



  render() {
    return html`
      <div class="wrap">
        <sl-skeleton effect="sheen" class="icon"></sl-skeleton>
        <sl-skeleton effect="sheen" class="version"></sl-skeleton>
        <sl-skeleton effect="sheen" class="stats"></sl-skeleton>
        <sl-skeleton effect="sheen" class="actions"></sl-skeleton>
      </div>
    `
  };
}

customElements.define('pup-snapshot-skeleton', PupSnapshotSkeleton);