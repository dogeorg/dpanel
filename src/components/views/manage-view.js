import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import '/components/views/pup-snapshot/pup-snapshot.js'

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
    .details-group pup-snapshot:not(:last-of-type) {
      margin-bottom: var(--sl-spacing-x-small);
    }
  `

  render() {
    return html`
      <div class="padded">
        
        <h1>Manage</h1>

        <div class="details-group">
          <pup-snapshot
            pupId="core"
            pupName="Core"
            version="12.2.1"
            icon="box">
          </pup-snapshot>

          <pup-snapshot
            pupId="gigawallet"
            pupName="GigaWallet"
            version="2.1.3"
            icon="wallet2">
          </pup-snapshot>

          <pup-snapshot
            pupId="identity"
            pupName="Identity"
            version="1.0.1"
            icon="person-circle">
          </pup-snapshot>

          <pup-snapshot
            pupId="shibeshop"
            pupName="ShibeShop"
            version="3.1.3"
            icon="bag">
          </pup-snapshot>

          <pup-snapshot
            pupId="tipjar"
            pupName="Tipjar"
            version="8.2.3"
            icon="hand-thumbs-up">
          </pup-snapshot>
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