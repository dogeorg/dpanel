import { LitElement, html, css, choose } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import "/components/common/sparkline-chart/sparkline-chart-v2.js";

class MetricView extends LitElement {
  static get properties() {
    return {
      metric: { type: Object },
      expand: { type: Boolean, reflect: true }
    }
  }

  constructor() {
    super();
    this.metric = {}
    this.expand = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.handleClick)
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.handleClick)
    super.disconnectedCallback();
  }

  handleClick() {
    this.expand = !this.expand
  }

  render () {
    const type = this.metric.type || null

    return html`
      <sl-tooltip content="${this.metric.label}" placement="top-start" hoist>
        <span class="label">
          ${this.metric.label}
          </span>
      </sl-tooltip>

      <sl-copy-button class="copy" value="${this.metric.values}" @click=${(e) => e.stopPropagation()}></sl-copy-button>

      <div class="value-container">
      ${choose(type, [
        ['int',   this.renderChart],
        ['float', this.renderChart],
        ['string', this.renderText]
        ], () => html`not supported`)
      }
      </div>

    `
  }

  renderChart = () => {
    const values = this.metric.values.filter(Boolean)

    // Make sure we have at least 2 data points to make a line.
    if (values.length < 2) {
      return html`<span>-</span>`
    }

    return html`
      <sparkline-chart-v2 .data="${values}"></sparkline-chart-v2>
    `
  }

  renderText = () => {
    let value = this.metric.values[this.metric.values.length - 1]

    if (!value) {
      value = '-'
    }

    return html`<span class="string">${value}</span>`
  }

  static styles = css`
    :host {
      display: flex;
      position: relative;
      flex-direction: column;
      align-items: start;
      border-radius: 4px;
      padding: 6px 10px 10px 10px;
      border: 1px solid #1d5145;
      min-width: 120px;
      width: auto;
    }
    :host([expand]) {
      min-width: max-content;
      padding-right: 40px;
    }
    :host(:hover) .copy {
      visibility: visible;
    }
    .label {
      font-size: 0.8rem;
      color: #07ffae;
      font-weight: bold;
      text-transform: uppercase;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      max-height: 1.5rem;
      line-height: 1.5rem;
    }
    .label:hover {
      cursor: help;
    }
    .value-container {
      max-height: 40px;
      min-height: 40px;
      font-family: Monospace;
      font-weight: normal;
      font-size: 0.9rem;
    }
    .string {
      position: relative;
      display: inline-block;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      max-height: 2.9rem;
      line-height: 1.1rem;

      &::after {
        content: "";
        display: inline-block;
        position: absolute;
        bottom: 0px;
        left: 0px;
        width: 100%;
        height: 4px;
        background: linear-gradient(to bottom, transparent, #23252a);
      }
    }
    .copy {
      position: absolute;
      visibility: hidden;
      color: #555;
      right: 3px;
      top: 0px;
    }
  `
}

customElements.define('x-metric', MetricView);