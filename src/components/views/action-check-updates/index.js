import {
  LitElement,
  html,
  css,
  nothing,
  choose,
} from "/vendor/@lit/all@3.1.2/lit-all.min.js";
import { createAlert } from "/components/common/alert.js";
import { asyncTimeout } from "/utils/timeout.js";
import "/components/common/action-row/action-row.js";
import "/components/common/reveal-row/reveal-row.js";
import "/components/views/x-activity-log.js";
import { checkForUpdates, commenceUpdate } from "/api/system/updates.js";
import { store } from "/state/store.js";
import { getBootstrapV2 } from "/api/bootstrap/bootstrap.js";

const PAGE_ONE = "checking";
const PAGE_TWO = "confirmation";
const PAGE_THREE = "installation";

export class CheckUpdatesView extends LitElement {
  static get properties() {
    return {
      mode: { type: String }, // either canInstall or mustInstall
      open: { type: Boolean, reflect: true },
      _ready: { type: Boolean },
      _updates: { type: Object },
      _has_updates: { type: Boolean },
      _inflight_checking: { type: Boolean },
      _confirmation_checked: { type: Boolean },
      _inflight_update: { type: Boolean},
      _update_commenced: { type: Boolean },
      _update_outcome: { type: Boolean },
      _page: { type: String },
      _logs: { type: Array },
    };
  }

  constructor() {
    super();
    this.mode = "";
    this._ready = false;
    this._page = PAGE_ONE;
    this._logs = [];
  }

  firstUpdated() {
    this.fetchUpdates();
  }

  async fetchUpdates() {
    // Reset
    this._updates = false;
    this._inflight_checking = true;

    // Fetch
    this._updates = await checkForUpdates();
    await asyncTimeout(2200);

    // TODO
    this._has_updates = true;
    this._inflight_checking = false;
  }

  handleReviewUpdates() {
    this._page = PAGE_TWO;
  }

  async mockUpdateLogs() {
    const asyncTimeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    const updateMessages = [
      "Checking for system updates...",
      "Downloading package lists...",
      "Calculating upgrade requirements...",
      "Installing security patches...",
      "Updating system packages...",
      "Upgrading core components...",
      "Configuring new packages...",
      "Cleaning up temporary files...",
      "Verifying system integrity...",
      "Updating system services...",
      "Rebuilding package cache...",
      "Running post-install scripts..."
    ];
    
    const pushBatch = (count) => {
      for (let i = 0; i < count; i++) {
        const randomMsg = updateMessages[Math.floor(Math.random() * updateMessages.length)];
        this._logs = [...this._logs, { msg: randomMsg }];
      }
    };
    await asyncTimeout(1200);

    // First batch: 3 messages
    pushBatch(3);
    this.requestUpdate();
    await asyncTimeout(1200);
    
    // Second batch: 6 messages
    pushBatch(6);
    this.requestUpdate();
    await asyncTimeout(2200);
    
    // Third batch: 3 messages
    pushBatch(3);
    this.requestUpdate();
    await asyncTimeout(1200);
    
    // Fourth batch: 6 messages
    pushBatch(6);
    this.requestUpdate();
    await asyncTimeout(2200);

    // Finish
    this._logs = [...this._logs, { msg: 'Updates complete' }];

    // this._inflight_update = false;
    // this._update_outcome = 'success';
  }

  render() {
    return html`
      <div class="wrap">
        ${choose(this._page, [
          [PAGE_ONE, this.renderIntro],
          [PAGE_TWO, this.renderConfirm],
          [PAGE_THREE, this.renderUpdating],
        ])}
      </div>
    `;
  }

  renderIntro = () => {
    return html`
      <div class="page">
        <h1>System Updates</h1>

        ${this._inflight_checking ? html `
        <sl-alert open variant="primary" style="text-align: left">
          <small style="display:inline-block; margin-bottom: 4px;">Checking for updates</small>
          <sl-progress-bar indeterminate></sl-progress-bar>
        </sl-alert>

        <p style="line-height: 1.1; color: #777">
          <small>Explanation..</small>
          <sl-button size="small" variant="text" disabled>Check again</sl-button>
        </p>
        `: nothing}

        ${!this._inflight_checking && !this._has_updates ? html`
        <sl-alert open variant="primary" style="text-align: left">
          <small style="display:inline-block; margin-bottom: 4px;">Check complete</small>
          <sl-progress-bar value="100"></sl-progress-bar>
        </sl-alert>

        <p style="line-height: 1.1; color: #777">
          <small>You're up to date.</small>
          <sl-button size="small" variant="text" @click=${this.fetchUpdates}>Check again</sl-button>
        </p>
        `: nothing}

        ${!this._inflight_checking && this._has_updates ? html`
        <sl-alert open variant="primary" style="text-align: left">
          <small style="display:inline-block; margin-bottom: 4px;">Update available</small>
          <sl-progress-bar value="100"></sl-progress-bar>
          <sl-button style="display: block; margin-top: 16px;" @click=${this.handleReviewUpdates}>Review Updates</sl-button>
        </sl-alert>

        <p style="line-height: 1.1; color: #777">
          <small>Explanation..</small>
          <sl-button size="small" variant="text" @click=${this.fetchUpdates}>Check again</sl-button>
        </p>
        `: nothing}

      </div>
    `;
  };

  renderConfirm = () => {
    return html`
      <div class="page">

        <sl-button variant="text" @click=${() => { this._page = PAGE_ONE; this._confirmation_checked = false;}} class="back-button">
          Back
        </sl-button>

        <h1>System Updates</h1>
        
        <div class="updates-list">
          <action-row prefix="box" expandable label="Dogebox v0.3.2">
            Short description
            <div slot="hidden"><small>Lorem ad ex nostrud magna nisi ea enim magna exercitation aliquip enim amet ad deserunt sit irure aute proident.</div>
          </action-row>
        </div>

        <sl-alert open variant="warning" style="text-align: left">
          <sl-icon slot="icon" name="info-circle"></sl-icon>
          Take care. Updating can take some time.<br><strong>Do not turn off your Dogebox</strong>.
        </sl-alert>

        <sl-divider></sl-divider>

        <div class="action-wrap">
          <sl-checkbox @sl-change=${this.handleCheckboxChange} ?disabled=${this._inflight_update}>I understand</sl-checkbox>
          <sl-button variant="warning" ?disabled=${!this._confirmation_checked || this._inflight_update} @click=${this.handleSubmit}>
            Update now
          </sl-button>
        </div>

      </div>
    `;
  };

  renderUpdating = () => {
    return html`
      <div class="page">

        <h1>System Updates</h1>

        ${!this._inflight_update && this._update_outcome === "success" ? html`
          <sl-alert open variant="success" style="text-align: left">
          <small style="display:inline-block; margin-bottom: 4px;">Update complete</small>
          <sl-progress-bar value=100 style="--indicator-color: var(--sl-color-success-600)"></sl-progress-bar>
        </sl-alert>
        `: nothing }

        ${!this._inflight_update && this._update_outcome === "error" ? html`
          <sl-alert open variant="danger" style="text-align: left">
          <small style="display:inline-block; margin-bottom: 4px;">Update failed</small>
          <sl-progress-bar value=1 style="--indicator-color: var(--sl-color-danger-600)"></sl-progress-bar>
        </sl-alert>
        `: nothing }

        ${this._inflight_update ? html`
        <sl-alert open variant="primary" style="text-align: left">
          <small style="display:inline-block; margin-bottom: 4px;">
            ${this._update_commenced ? "Update in progress..." : "Commencing update..." }
          </small>
          <sl-progress-bar indeterminate></sl-progress-bar>
        </sl-alert>
        `: nothing }

        <div class="activity-log-wrap">
          <x-activity-log .logs=${this._logs}></x-activity-log>
        </div>

        ${this._inflight_update ? html`
          <p style="line-height: 1.1"><small>This may take 10 minutes or more.  Do not refresh or power off your Dogebox while update is in progress.</small></p>`
        : nothing }

        ${!this._inflight_update && this._update_outcome ? html`
          <p><small>Explanation..</small> <sl-button size="small" variant="text">Dismiss</sl-button></p>`
        : nothing }

      </div>
    `;
  }

  handleCheckboxChange(e) {
    this._confirmation_checked = e.target.checked;
  }

  async handleSubmit() {
    this._page = PAGE_THREE;
    this._update_commenced = false;
    this._inflight_update = true;

    // TODO: remove mocked activity logs.
    this.mockUpdateLogs();

    let didErr = false;

    try {
      await asyncTimeout(3000);
      const res = await commenceUpdate();
      this._update_commenced = true;
    } catch (err) {
      didErr = true;
      console.log("Update error:", err);
      createAlert('danger', 'Failed to commence update')
      this._inflight_update = false;
      this._update_outcome = "error"
    }

    if (!didErr) {
      // Initiate a poll for version change.
      // When version change is detected, flick to success screen.
      this.pollForUpdateChange({ currentVersion: store.appContext.dbxVersion })
    }
  }

  async pollForUpdateChange({ currentVersion }) {
    const intervalId = setInterval(async () => {
      try {
        const { version } = await getBootstrapV2();

        if (version?.release && version.release !== currentVersion) {
          clearInterval(intervalId);
          console.debug('New version found:', version.release);
          this._inflight_update = false;
          this._update_outcome = "success";
        }
      } catch {
        // Squelch errs.  If bootstrap failed, it will try again.
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }

  static styles = css`
    .wrap {
      text-align: center;
      position: relative;

      h1 {
        display: block;
        margin-top: 0px;
        font-family: 'Comic Neue';
        font-weight: bold;
      }

    }

    .back-button {
      position: absolute;
      left: -12px;
      top: -16px;
    }

    .alert-wrap {
      width: calc(360px + 1em);
      margin: 1em auto;
    }

    .action-wrap {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 1.5em;
      width: 100%;
    }

    .updates-list {
      text-align: left;
      padding-bottom: 30px;
    }

    .activity-log-wrap {
      text-align: left;
      margin-top: 12px;
    }
  `;
}

customElements.define("x-action-check-updates", CheckUpdatesView);
