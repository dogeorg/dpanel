import { html } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

export function renderSummary() {
  return html`
    <div class="title-wrap">
      ${this.renderSummaryTitle()}
    </div>

    <div class="center">
      ${this.renderSummaryCharts()}
    </div>

    <div class="right">
      ${this.renderSummaryActions()}
    </div>
  `
}