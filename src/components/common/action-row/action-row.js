import { LitElement, html, css } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

class ActionRow extends LitElement {
  static get properties() {
    return {
      label: { type: String },
      prefix: { type: String },
      suffix: { type: String },
      trigger: { type: Object },
      variant: { type: String },
      loading: { type: Boolean },
      href: { type: String },
      disabled: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.label = "";
    this.prefix = "columns-gap";
    this.suffix = "chevron-right";
    this.trigger = false;
    this.href = "";
    this.disabled = false;
  }

  static styles = css`
    :host {
      color: var(--sl-color-neutral-600);
    }

    a, button {
      touch-action: manipulation;
    }

    .anchor {
      color: inherit;
      text-decoration: inherit;
    }

    /* VARIANTS */
    :host([variant="primary"]) {
      color: var(--sl-color-primary-600);
    }
    :host([variant="success"]) {
      color: var(--sl-color-success-600);
    }
    :host([variant="warning"]) {
      color: var(--sl-color-warning-600);
    }
    :host([variant="danger"]) {
      color: var(--sl-color-danger-600);
    }

    /* HOVER STATES */
    :host([variant="primary"]:hover) {
      color: var(--sl-color-primary-800);
    }
    :host([variant="success"]:hover) {
      color: var(--sl-color-success-800);
    }
    :host([variant="warning"]:hover) {
      color: var(--sl-color-warning-800);
    }
    :host([variant="danger"]:hover) {
      color: var(--sl-color-danger-800);
    }
    :host(:hover) {
      color: var(--sl-color-neutral-800);
      cursor: pointer;
    }

    /* DISABLED STATE */
    :host([disabled]) {
      pointer-events: none;
      color: var(--sl-color-neutral-400);
    }

    :host([disabled]:hover) {
      color: var(--sl-color-neutral-400);
    }


    .base-wrap {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: var(--row-height, 62px);
      align-items: center;
    }

    .prefix-wrap {
      width: 48px;
      max-width: 48px;
      flex: 0 0 auto; /* Do not grow, or shrink, basis auto */
      display: flex;
      align-items: center;
      font-size: 1.5rem;
    }

    .body-wrap {
      height: var(--row-height,62px);
      padding-bottom: 2px;
      flex: 1 0 auto; /* Grow to fill the space, no shrink, basis auto */
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-bottom: 1px solid #333;
      max-width: calc(100% - 80px);
      gap: 0.25em;

      .label-wrap {
        line-height: 1.1;
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .description-wrap {
        line-height: 1;
        font-size: 0.9rem;
        font-family: "Comic Neue";
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .more-wrap {
        line-height: 1;
        font-size: 0.9rem;
        font-family: "Comic Neue";
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .label-wrap, 
      .description-wrap,
      .more-wrap  {
        flex-grow: 0;
        flex-shrink: 1;
        max-width: calc(100% - 10px);
      }
    }

    .suffix-wrap {
      height: 100%;
      max-width: 48px;
      flex: 0 1 auto; /* Do not grow, can shrink, basis auto */
      display: flex;
      align-items: center;
      justify-content: end;
      padding-right: 0.2em;
      padding-left: 1em;

      border-bottom: 1px solid #333;
      padding-top: 2px;
    }
  `;

  handleClick = (e) => {
    if (this.trigger) {
      if (typeof this.trigger === "function") {
        this.trigger(e, this);
      } else {
        console.warn(
          "Trigger provided is not a function",
          typeof this.trigger,
          this.trigger,
        );
      }
    }
  };

  render() {

    const el = html`
      <div class="base-wrap" part="base" @click=${this.handleClick}>
        <div class="prefix-wrap" part="prefix">
          ${this.loading
            ? html` <sl-spinner></sl-spinner> `
            : html`
                <slot name="prefix"></slot>
                <sl-icon name="${this.prefix}"></sl-icon>
              `}
        </div>

        <div class="body-wrap" part="body">
          <div class="label-wrap">
            <slot name="label">${this.label}</slot>
          </div>
          <div class="description-wrap">
            <slot></slot>
          </div>
          <div class="more-wrap">
            <slot name="more"></slot>
          </div>
        </div>

        <div class="suffix-wrap" part="suffix">
          <slot name="suffix">
            <sl-icon name="${this.suffix || "chevron-right"}"></sl-icon>
          </slot>
        </div>
      </div>
    `
    return html`
      ${this.href ? html`
        <a class="anchor" href="${this.href}" target="_self">${el}</a>
      ` : el}
    `;
  }
}

customElements.define("action-row", ActionRow);
