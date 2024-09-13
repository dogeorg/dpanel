import { LitElement, html, css, nothing } from "/vendor/@lit/all@3.1.2/lit-all.min.js";
import { createAlert } from "/components/common/alert.js";
import { asyncTimeout } from "/utils/timeout.js";
import { pkgController } from "/controllers/package/index.js";
import { addSource, removeSource } from "/api/sources/manage.js";

export class SourceManagerView extends LitElement {

  static get properties() {
    return {
      _ready: { type: Boolean },
      _showSourceRemovalConfirmation: { type: Boolean },
      _showAddSourceDialog: { type: Boolean },
      _sourceRemovaInProgress: { type: Boolean },
      _sources: { type: Object, state: true },
      _selectedSourceId: { type: String },
      _addSourceInputURL: { type: String },
      _addSourceInProgress: { type: Boolean },
    }
  }

  constructor() {
    super();
    this._ready = false;
    this._sources = [];
    
    this._showSourceRemovalConfirmation = false;
    this._showAddSourceDialog = false;
    
    this._sourceRemovaInProgress = false;
    this._addSourceInProgress = false;
    
    this._selectedSourceId = null;
    this._addSourceInputURL = "";
  }

  firstUpdated() {
    this.fetchSources()
  }

  fetchSources() {
    this._sources = pkgController.getSourceList()
    setTimeout(() => { this._ready = true; }, 1000);
  }

  handleRemoveClick(sourceId) {
    this._selectedSourceId = sourceId
    this._showSourceRemovalConfirmation = true;
  }

  async handleRemovalConfirmClick() {
    if (!this._selectedSourceId) {
      console.warn('apparantely no source is selected')
    }
    this._sourceRemovaInProgress = true;
    try {
      await asyncTimeout(1000);
      await removeSource(this._selectedSourceId);
      createAlert("success", 'Source removed.', 'check-square', 2000);

      // TODO better success handling
      await asyncTimeout(2000);
      window.location.reload();

    } catch (err) {
      console.log('ERROR', err);
      const message = ["Source removal failed", "Please refresh your browser and try again"];
      const action = { text: "View details" };
      createAlert("danger", message, "emoji-frown", null, action, new Error(err));
    } finally {
      this._sourceRemovaInProgress = false;
      this._selectedSourceId = null;
    }
  }

  handleAddSourceClick() {
    this._showAddSourceDialog = true;
  }

  async handleAddSourceSubmitClick() {
    this._addSourceInProgress = true;
    try {
      await asyncTimeout(1000);
      await addSource(this._addSourceInputURL);
      createAlert("success", 'Source added.', 'check-square', 2000);

      // TODO better success handling
      await asyncTimeout(2000);
      window.location.reload();

    } catch (err) {
      console.log('ERROR', err);
      const message = ["Failed to add source.", "Please refresh your browser and try again"];
      const action = { text: "View details" };
      createAlert("danger", message, "emoji-frown", null, action, new Error(err));
    } finally {
      this._addSourceInProgress = false;
    }
  }

  render() {

    const renderSourceAction = (sourceId) => {
      return html`
        <div class="dropdown-selection-alt" slot="suffix">
          <sl-dropdown>
            <sl-button slot="trigger" caret></sl-button>
            <sl-menu>
              <sl-menu-item value="copy" @click=${() => this.handleRemoveClick(sourceId)}>Remove</sl-menu-item>
            </sl-menu>
          </sl-dropdown>
        </div>
      `
    }

    const renderAddSource = () => {
      return html`
        <sl-dialog ?open=${this._showAddSourceDialog} style="--width: 55vw" no-header>
          
          <sl-input
            label="Enter source URL"
            placeholder="Eg: https://github.com/SomeoneWeird/test-pups.git"
            @sl-input=${(e) => this._addSourceInputURL = e.target.value }
            >
          </sl-input>

          <div slot="footer">
            <sl-button variant="text" @click=${() => this._showAddSourceDialog = false}>Cancel</sl-button>
            <sl-button variant="primary" ?disabled=${!this._addSourceInputURL} ?loading=${this._addSourceInProgress} @click=${this.handleAddSourceSubmitClick}>
              Add this source
            </sl-button>
          </div>
          
        </sl-dialog>
      `
    }

    const renderRemovalConfirmation = () => {
      return html`
        <sl-dialog ?open=${this._showSourceRemovalConfirmation} style="--width: auto" no-header>
          <div style="max-width: 320px;">
            <h3>Are you sure?</h3>
            You will no longer see pups from this source.
          </div>
          <div slot="footer">
            <sl-button variant="text" @click=${() => this._showSourceRemovalConfirmation = false}>Cancel</sl-button>
            <sl-button variant="danger" ?loading=${this._sourceRemovaInProgress} @click=${this.handleRemovalConfirmClick}>
              Yes, delete this source
              <sl-icon slot="suffix" name="trash3-fill"></sl-icon>
            </sl-button>
          </div>
          
        </sl-dialog>
      `
    }

    return html`
      <sl-dialog open label="Pup Sources" style="position: relative;">
        
        ${!this._ready ? html`
          <div class="loader-overlay">
            <sl-spinner style="font-size: 2rem; --indicator-color: #bbb;"></sl-spinner>
          </div>
        ` : nothing }
        
        ${this._ready ? html`

          ${this._sources.map((s) => html`
            <action-row label="${s.name}" prefix="git">
              ${s.location}
              ${renderSourceAction(s.sourceId)}
            </action-row>`
          )}
        ` : nothing }

        <div slot="footer">
          <sl-button variant=primary ?disabled=${!this._ready} @click=${this.handleAddSourceClick}>
            <sl-icon slot="prefix" name="plus-square-fill"></sl-icon>
            Add Source
          </sl-button>
        </div>
      ${renderRemovalConfirmation()}
      ${renderAddSource()}
      </sl-dialog>
    `
  }

  static styles = css`
    .loader-overlay {
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `
}

customElements.define("action-manage-sources", SourceManagerView);