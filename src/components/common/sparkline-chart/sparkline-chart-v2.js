import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import { sparkline } from '/vendor/@fnando/sparkline@0.3.10/sparkline.js';
import { generateMockSparklineData } from './mocks/sparkline.mocks.js';

class SparklineChart extends LitElement {
  static properties = {
    data: { type: Array },
    label: { type: String },
    disabled: { type: Boolean },
    mock: { type: Boolean }
  };

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      position: relative;
      border-bottom:1px solid #1d5145;
    }
    svg {
      width: auto;
      height: 40px;
    }
    .tooltip {
      position: absolute;
      background: rgba(0, 0, 0, .7);
      color: #fff;
      padding: 2px 5px;
      font-size: 12px;
      white-space: nowrap;
      z-index: 9999;
      display: none;
    }
    .label {
      font-size: var(--sl-font-size-x-small);
    }
    .label[disabled] {
      color: grey;
    }
    .sparkline--cursor {
      stroke: #ffbd11;
    }
    .sparkline--spot {
      fill: white;
      stroke: white;
    }
  `;

  constructor() {
    super();
    this.dataToUse = [];
    this.options = {
      onmousemove: (event, datapoint, index) => {
        if (this.disabled || datapoint === undefined) return;
        const tooltip = this.shadowRoot.querySelector('.tooltip');
        
        tooltip.style.display = 'block';
        tooltip.textContent = `Value: ${datapoint.value}`;
        tooltip.style.top = `${event.offsetY}px`;
        tooltip.style.left = `${event.offsetX + 20}px`;
      },
      onmouseout: () => {
        if (this.disabled) return;
        const tooltip = this.shadowRoot.querySelector('.tooltip');
        tooltip.style.display = 'none';
      }
    };
  }

  render() {
    const fill = this.disabled ? "rgba(255, 255, 255, 0.1)" : "rgb(7, 255, 174, 0.2)";
    return html`
      ${this.label ? html`<span class="label" ?disabled=${this.disabled}>${this.label}</span>` : ''}
      <svg
        part="sparkline-svg"
        width="130" height="40"
        stroke-width="2"
        stroke="${this.disabled ? 'grey' : 'rgb(7, 255, 174)'}"
        fill="${fill}">
      </svg>
      <div class="tooltip"></div>
    `;
  }

  updated(changedProperties) {
    if (changedProperties.has('data') || changedProperties.has('mock')) {
      this.drawSparkline();
    }
  }

  drawSparkline() {
    if (this.mock) {
      const mockDataCount = 10;
      this.dataToUse = generateMockSparklineData(mockDataCount);
    } else if (Array.isArray(this.data)) {
      this.dataToUse = this.data.map(item => 
        typeof item === 'number' ? item : (item.value || 0)
      );
    } else {
      this.dataToUse = [];
    }

    const svg = this.shadowRoot.querySelector('svg[part="sparkline-svg"]');
    sparkline(svg, this.dataToUse, this.options);
  }
}

customElements.define('sparkline-chart-v2', SparklineChart);