import { html } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

export function renderSummaryCharts() {
  return html`
    <sparkline-chart
      mock
      ?disabled=${!this.running}
      label="CPU usage"
      unit="%"
      .data=${this.stats.cpu}>
    </sparkline-chart>
    <sparkline-chart 
      mock
      ?disabled=${!this.running}
      label="MEM usage"
      unit="%"
      .data=${this.stats.mem}>
    </sparkline-chart>
    <sparkline-chart 
      mock
      ?disabled=${!this.running}
      label="DISK usage"
      unit="%"
      .data=${this.stats.disk}>
    </sparkline-chart>
  `
}