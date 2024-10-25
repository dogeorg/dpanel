import { LitElement, html, css, nothing } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

// Utils
import { asyncTimeout } from "/utils/timeout.js";

// APIS
import { postKeyImport } from "/api/keys/import-key.js"

// Components
import "/components/common/dynamic-form/dynamic-form.js";
import { createAlert } from "/components/common/alert.js";

export class ImportKey extends LitElement {
  static get properties() {
    return {
      onSuccess: { type: Object },
      _show_ui_err: { type: String }
    };
  }

  constructor() {
    super();
    this.onSuccess = () => console.log('onSucces not defined');
    this._importKeyFormFields = {
      sections: [
        {
          name: "Import key",
          submitLabel: "Import",
          fields: [
            {
              name: "seedphrase",
              label: "Enter Recovery Phrase (24-words)",
              type: "seedphrase",
              placeholder: "hungry tavern drumkit weekend dignified turmoil cucumber ...",
              required: true,
            },
          ],
        },
      ],
    };
  }

  _attemptKeyImport = async (data, form, dynamicFormInstance) => {
    this._show_ui_err = false; // reset err flag
    let didErr;
    try { 
      await postKeyImport()
      createAlert('success', 'Key imported successfully');
    } catch (err) {
      didErr = true;
      this._show_ui_err = err.toString();
      createAlert('danger', 'Key imported failed');
    } finally {
      dynamicFormInstance.retainChanges() // stops spinner
    }

    if (didErr) return;
    
    if (this.onSuccess && typeof this.onSuccess === 'function') {
      this.onSuccess()
    }
  }

  render() {
    return html`
      <sl-alert variant="danger" closable ?open=${!!this._show_ui_err} style="margin: 0 8px 16px 8px">
        ${this._show_ui_err}
      </sl-alert>

      <dynamic-form
        .fields=${this._importKeyFormFields}
        .values=${{}}
        .onSubmit=${this._attemptKeyImport}
        requireCommit
        >
      </dynamic-form>
    `
  }

}

customElements.define('x-action-import-key', ImportKey);