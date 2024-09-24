import { LitElement, html, css, choose } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import "/components/common/sparkline-chart/sparkline-chart-v2.js";

class MetricView extends LitElement {
  static get properties() {
    return {
      metric: { type: Object },
    }
  }

  constructor() {
    super();
    this.metric = {}
  }

  render () {
    const type = this.metric.type || null

    return html`
      <sl-tooltip content="${this.metric.name}" placement="top-start" hoist>
        <span class="label">${this.metric.label}</span>
      </sl-tooltip>

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
      return html`<span style="font-weight: bold;">-</span>`
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

    return html`<span style="font-weight: bold;">${value}</span>`
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: start;
      border-radius: 4px;
      padding: 6px 10px 10px 10px;
      border: 1px solid #1d5145;
    }
    .label {
      font-size: 0.8rem;
      color: #07ffae;
      font-weight: bold;
      text-transform: uppercase;
    }
    .label:hover {
      cursor: help;
    }
    .value-container {
      max-height: 40px;
      min-height: 40px;
    }
  `
}

customElements.define('x-metric', MetricView);