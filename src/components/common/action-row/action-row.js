import { LitElement, html, css } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

class ActionRow extends LitElement {
  static get properties() {
    return {
      label: { type: String },
      prefix: { type: String },
      suffix: { type: String },
      trigger: { type: Object }
    };
  }

  constructor() {
    super();
    this.label = "";
    this.prefix = "columns-gap";
    this.suffix = "chevron-right";
    this.trigger = false;
  }

  static styles = css`
    :host {
      color: var(--sl-color-neutral-600);
    }
    .base-wrap:hover {
      color: var(--sl-color-neutral-950);
      cursor: pointer;
    }

    .base-wrap {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 62px;
      align-items: center;
    }

    .prefix-wrap {
      width: 48px;
      max-width: 48px;
      flex: 0 1 auto; /* Do not grow, can shrink, basis auto */
      display: flex;
      align-items: center;
      justify-content: start;
      font-size: 1.5rem;
    }

    .body-wrap {
      height: 62px;
      padding-bottom: 2px;
      flex: 1 1 auto; /* Grow to fill the space, can shrink, basis auto */
      display: flex;
      flex-direction: column;
      justify-content: center;

      .label-wrap {
        font-weight: bold;
      }

      .description-wrap {
        line-height: 1;
        font-size:0.9rem;
        font-family: 'Comic Neue';
      }

      border-bottom: 1px solid #333;
    }

    .suffix-wrap {
      height: 100%;
      max-width: 48px;
      flex: 0 1 auto; /* Do not grow, can shrink, basis auto */
      display: flex;
      align-items: center;
      justify-content: end;
      padding-right: 1em;
      padding-left: 1em;

      border-bottom: 1px solid #333;
      padding-top: 2px;
    }
  `;

  handleClick = (e) => {
    if (this.trigger) {
      if (typeof this.trigger === 'function') {
        this.trigger(e, this);
      } else {
        console.warn('Trigger provided is not a function', typeof this.trigger, this.trigger);
      }
    }
  }

  render() {
    return html`
      <div class="base-wrap" part="base" @click=${this.handleClick}>

        <div class="prefix-wrap" part="prefix">
          <slot name="prefix"></slot>
          <sl-icon name="${this.prefix}"></sl-icon>
        </div>

        <div class="body-wrap" part="body">
          <div class="label-wrap">
            <slot name="label">${this.label}</slot>
          </div>
          <div class="description-wrap">
            <slot></slot>
          </div>
        </div>

        <div class="suffix-wrap" part="suffix">
          <slot name="suffix"></slot>
          <sl-icon name="chevron-right"></sl-icon>
        </div>

      </div>
    `;
  }
}

customElements.define("action-row", ActionRow);

