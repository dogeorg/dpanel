import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import { sparkline } from '/vendor/@fnando/sparkline@0.3.10/sparkline.js';

class SparklineChart extends LitElement {
  static properties = {
    data: { type: Array },
    label: { type: String },
    disabled: { type: Boolean }
  };

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      position: relative; // Ensure tooltip positions correctly

    }
    svg {
      width: auto;
      height: 30px;
    }
    .tooltip {
      position: absolute;
      background: rgba(0, 0, 0, .7);
      color: #fff;
      padding: 2px 5px;
      font-size: 12px;
      white-space: nowrap;
      z-index: 9999;
      display: none; // Start hidden
    }
    .label {
      font-size: var(--sl-font-size-x-small);
    }

    .label[disabled] {
      color: lightgrey;
    }

    .sparkline--cursor {
      stroke: orange;
    }

    .sparkline--spot {
      fill: red;
      stroke: red;
    }
  `;

  constructor() {
    super();
    this.options = {
      onmousemove: (event, datapoint) => {
        if (this.disabled) return;
        const tooltip = this.shadowRoot.querySelector('.tooltip');
        
        tooltip.style.display = 'block';
        tooltip.textContent = `${datapoint.date}: ${datapoint.value}%`;
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
    const fill = this.disabled ? "rgba(0, 0, 0, 0.1)" :"rgba(0, 0, 255, .2)"
    return html`
      ${this.label ? html`<span class="label" ?disabled=${this.disabled}>${this.label}</span>` : ''}
      <svg
        part="sparkline-svg"
        width="100" height="30" // Adjust size as needed
        stroke-width="2"
        stroke="${this.disabled ? 'lightgrey' : 'blue'}"
        fill="${fill}"
        @mousemove="${this.handleMouseMove}"
        @mouseout="${this.handleMouseOut}">
      </svg>
      <div class="tooltip"></div>
    `;
  }

  handleMouseMove(event) {
    // Delegate to sparkline's mousemove handler if options are set
    if (this.options.onmousemove) {
      const datapoint = this.data[event.detail.index];
      this.options.onmousemove(event, datapoint);
    }
  }

  handleMouseOut(event) {
    // Delegate to sparkline's mouseout handler if options are set
    if (this.options.onmouseout) {
      this.options.onmouseout(event);
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('data')) {
      this.drawSparkline();
    }
  }

  drawSparkline() {
    const svg = this.shadowRoot.querySelector('svg[part="sparkline-svg"]');
    // Pass options to the sparkline function
    sparkline(svg, this.data, this.options);
  }
}

customElements.define('sparkline-chart', SparklineChart);