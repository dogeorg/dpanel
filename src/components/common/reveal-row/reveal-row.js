import { LitElement, html, css } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

class RevealRow extends LitElement {
  static get properties() {
    return {
      label: { type: String },
      expanded: { type: Boolean }
    };
  }

  static styles = css`
    :host {
      display: block;
      position: relative;
      line-height: 1.5rem;
      font-size: 1rem;
    }

    .body-wrap {
      transition: max-height 0.2s ease-in-out;
      overflow: hidden;
      position: relative;
    }

    .collapsed {
      max-height: 7em;
      cursor: pointer;
    }

    .expanded {
      max-height: none;
    }

    .shadow {
      position: absolute;
      bottom: 0px;
      left: 0;
      right: 0;
      height: 30px;
      background: linear-gradient(to bottom, transparent, rgba(35, 37, 42, 0.7));
      display: var(--shadow-display, block);
    }

    .footer {
      display: flex;
      align-items: start;
      justify-content: center;
    }
    .footer .suffix {
      border-top: 1px solid rgb(51, 51, 51);
      margin-top: 1em;
      padding: 0em 2em;
      display: flex;
      justify-content: end;
    }
  `;

  constructor() {
    super();
    this.label = "";
    this.expanded = false;
  }

  performExpand() {
    this.expanded = true;
    this.style.setProperty('--shadow-display', 'none');
  }

  performCollapse() {
    this.expanded = false;
    this.style.setProperty('--shadow-display', 'block');
  }

  render() {
    return html`
      <div>
        <div part="body" @click=${this.performExpand} class="body-wrap ${this.expanded ? 'expanded' : 'collapsed'}">
          <slot></slot>
          <div class="shadow"></div>
        </div>
        <div class="footer">
          <div class="suffix">
            <sl-button
              variant="text"
              class="toggle-button"
              @click=${() => this.expanded ? this.performCollapse() : this.performExpand() }
            >${this.expanded ? 'Show less' : 'Show more'}
            </sl-button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("reveal-row", RevealRow);