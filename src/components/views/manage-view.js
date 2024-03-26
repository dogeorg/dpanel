import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

import '/components/common/dynamic-form/dynamic-form.js'
import '/components/common/animated-dots.js'
import '/components/common/sparkline-chart.js'
import * as dataSets from '/components/common/dynamic-form/mocks/index.js'

class ManageView extends LitElement {

  static styles = css`
    :host {
      display: block;
      height: 100vh;
      width: 100%;
      overflow-y: auto;
    }
    .padded {
      padding: 20px;
    }
    h1 {
      font-family: 'Comic Neue', sans-serif;
    }

    /* Details toggle */
    .details-group sl-details:not(:last-of-type) {
      margin-bottom: var(--sl-spacing-x-small);
    }


    .details-group sl-details::part(summary-icon) {
      /* Disable the expand/collapse animation */
      display: none;
      rotate: none;
    }

    /* Summary buttons */
    .details-group sl-icon-button::part(base) {
      font-size: 1rem;
    }

    .details-summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .details-summary > div {
      min-width: 200px;
      display: flex;
      flex-direction: row;
      gap: 0.5em;
    }

    details-summary div.center {
      display: flex;
      justify-content: center;
      gap: 10px;
    }

    .details-summary > div:last-of-type {
      display: flex;
      justify-content: end;
      gap: 0.25em;
    }

    .chart-summary {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: baseline;
      font-size: var(--sl-font-size-x-small);
    }
  `

  firstUpdated() {
    const container = this.shadowRoot.querySelector('.details-group');

    // Close all other details when one is shown
    container.addEventListener('sl-show', event => {
      if (event.target.localName === 'sl-details') {
        [...container.querySelectorAll('sl-details')].map(details => (details.open = event.target === details));
      }
    });
  }

  render() {
    return html`
      <div class="padded">
        
        <h1>Manage</h1>

        <div class="details-group">
          <sl-details open>
            <div class="details-summary" slot="summary">
              
              <!-- ------ LEFT ------ -->
              <div class="title-wrap">
                <span class="title">Core</span>
                <span class="tags">
                  <sl-tag size="small" pill>v1.6.12</sl-tag>
                </span>
              </div>
              
              <!-- ------ CENTRE ------ -->
              <div class="center">
                <sparkline-chart 
                  label="CPU usage"
                  unit="%"
                  .data=${sparkCPUdata}>
                </sparkline-chart>
                <sparkline-chart 
                  label="MEM usage"
                  unit="%"
                  .data=${sparkMEMdata}>
                </sparkline-chart>
                <sparkline-chart 
                  label="DISK usage"
                  unit="%"
                  .data=${sparkDISKdata}>
                </sparkline-chart>
              </div>

              <!-- ------ RIGHT ------ -->
              <div class="right">
                </sl-tooltip>
                <sl-tooltip content="Stop">
                  <sl-button variant="danger" outline size="medium">
                    <sl-icon name="stop-fill" label="Stop"></sl-icon> Stop
                  </sl-button>
                </sl-tooltip>
              </div>
            </div>

            <!-- ##### CONTENT ##### -->
            <div class="content">
              <sl-tab-group>
                <sl-tab slot="nav" panel="general">Logs</sl-tab>
                <sl-tab slot="nav" panel="custom">Stats</sl-tab>
                <sl-tab slot="nav" panel="advanced">Config</sl-tab>

                <sl-tab-panel name="general">
                  This is the logs tab panel.
                </sl-tab-panel>
                <sl-tab-panel name="custom">This is the stats tab panel.</sl-tab-panel>
                <sl-tab-panel name="advanced">
                  <dynamic-form .data=${dataSets.split} orientation="landscape"></dynamic-form>
                </sl-tab-panel>
              </sl-tab-group>
            </div>
            <sl-icon name="plus-square" slot="expand-icon"></sl-icon>
            <sl-icon name="dash-square" slot="collapse-icon"></sl-icon>
          </sl-details>

          <sl-details>
            <div class="details-summary" slot="summary">
              
              <!-- ------ LEFT ------ -->
              <div class="title-wrap">
                <span class="title">GigaWallet</span>
                <span class="tags">
                  <sl-tag size="small" pill>v0.1.3</sl-tag>
                </span>
              </div>

              <!-- ------ CENTER ------ -->
              <div class="center">
                <sparkline-chart 
                  label="CPU usage"
                  unit="%"
                  .data=${sparkCPUdata.reverse()}>
                </sparkline-chart>
                <sparkline-chart 
                  label="MEM usage"
                  unit="%"
                  .data=${sparkMEMdata.reverse()}>
                </sparkline-chart>
                <sparkline-chart 
                  label="DISK usage"
                  unit="%"
                  .data=${sparkDISKdata}>
                </sparkline-chart>
              </div>

              <!-- ------ RIGHT ------ -->
              <div class="right">
                </sl-tooltip>
                <sl-tooltip content="Stop">
                  <sl-button variant="danger" outline size="medium">
                    <sl-icon name="stop-fill" label="Stop"></sl-icon> Stop
                  </sl-button>
                </sl-tooltip>
              </div>
            </div>

            <!-- ###### CONTENT ###### -->
            <div class="content">
              <sl-tab-group>
                <sl-tab slot="nav" panel="general">Logs</sl-tab>
                <sl-tab slot="nav" panel="custom">Stats</sl-tab>
                <sl-tab slot="nav" panel="advanced">Config</sl-tab>

                <sl-tab-panel name="general">
                  This is the logs tab panel.
                </sl-tab-panel>
                <sl-tab-panel name="custom">This is the stats tab panel.</sl-tab-panel>
                <sl-tab-panel name="advanced">This is the config tab panel.</sl-tab-panel>
              </sl-tab-group>
            </div>

            <sl-icon name="plus-square" slot="expand-icon"></sl-icon>
            <sl-icon name="dash-square" slot="collapse-icon"></sl-icon>
          </sl-details>

          <sl-details>

            <!-- ------ LEFT ------ -->
            <div class="details-summary" slot="summary">
              <div class="title-wrap">
                <span class="title">NodesMap</span>
                <span class="tags">
                  <sl-tag size="small" pill>v0.0.2</sl-tag>
                </span>
              </div>

              <!-- ------ CENTRE ------ -->
              <div class="center">
                <sparkline-chart 
                  disabled
                  label="CPU usage"
                  unit="%"
                  .data=${sparkCPUdata}>
                </sparkline-chart>
                <sparkline-chart 
                  disabled
                  label="MEM usage"
                  unit="%"
                  .data=${sparkMEMdata}>
                </sparkline-chart>
                <sparkline-chart 
                  disabled
                  label="DISK usage"
                  unit="%"
                  .data=${sparkDISKdata}>
                </sparkline-chart>
              </div>

              <!-- ------ RIGHT ------ -->
              <div class="right">
                <sl-tooltip content="Start">
                  <sl-button variant="success" outline size="medium">
                    <sl-icon name="play-fill" label="Start"></sl-icon> Start
                  </sl-button>
                </sl-tooltip>
              </div>
            </div>

            <!-- ###### CONTENT ###### -->
            <div class="content">
              <sl-tab-group>
                <sl-tab slot="nav" panel="general">Logs</sl-tab>
                <sl-tab slot="nav" panel="custom">Stats</sl-tab>
                <sl-tab slot="nav" panel="advanced">Config</sl-tab>

                <sl-tab-panel name="general">
                  This is the logs tab panel.
                </sl-tab-panel>
                <sl-tab-panel name="custom">This is the stats tab panel.</sl-tab-panel>
                <sl-tab-panel name="advanced">This is the config tab panel.</sl-tab-panel>
              </sl-tab-group>
            </div>

            <sl-icon name="plus-square" slot="expand-icon"></sl-icon>
            <sl-icon name="dash-square" slot="collapse-icon"></sl-icon>
          </sl-details>
        </div>

      </div>
    `;
  }
}

customElements.define('manage-view', ManageView);

const sparkCPUdata = [
  {
    "date": "2023-04-14T14:00:00Z",
    "value": 85
  },
  {
    "date": "2023-04-14T13:00:00Z",
    "value": 67
  },
  {
    "date": "2023-04-14T12:00:00Z",
    "value": 73
  },
  {
    "date": "2023-04-14T11:00:00Z",
    "value": 52
  },
  {
    "date": "2023-04-14T10:00:00Z",
    "value": 38
  }
];

const sparkMEMdata = [
  {
    "date": "2023-04-14T09:00:00Z",
    "value": 45
  },
  {
    "date": "2023-04-14T08:00:00Z",
    "value": 77
  },
  {
    "date": "2023-04-14T07:00:00Z",
    "value": 23
  },
  {
    "date": "2023-04-14T06:00:00Z",
    "value": 88
  },
  {
    "date": "2023-04-14T05:00:00Z",
    "value": 56
  }
]

const sparkDISKdata = [
  {
    "date": "2023-04-15T09:00:00Z",
    "value": 34
  },
  {
    "date": "2023-04-15T10:00:00Z",
    "value": 68
  },
  {
    "date": "2023-04-15T11:00:00Z",
    "value": 71
  },
  {
    "date": "2023-04-15T12:00:00Z",
    "value": 88
  },
  {
    "date": "2023-04-15T13:00:00Z",
    "value": 94
  }
]