import { LitElement, html, css } from "/vendor/@lit/all@3.1.2/lit-all.min.js";
import * as methods from "/components/common/dynamic-form/index.js";
import { bindToClass } from "/utils/class-bind.js";
import { styles } from "./styles.js";
import debounce from "/utils/debounce.js";

class DynamicForm extends LitElement {
  static get properties() {
    return {
      values: { type: Object },
      fields: { type: Object },
      onSubmit: { type: Object },
      requireCommit: { type: Boolean },
      markModifiedFields: { type: Boolean },
      allowDiscardChanges: { type: Boolean },
      _activeFormId: { type: String, state: true },
      _dirty: { type: Number, state: true },
      _loading: { type: Boolean, state: true },
      _orientation: { type: String, reflect: true },
    };
  }

  static styles = styles;

  constructor() {
    super();
    bindToClass(methods, this);
    this.values = {};
    this.fields = {};
    this.requireCommit = false;
    this.markModifiedFields = false;
    this.allowDiscardChanges = false;
    this._activeFormId = null;
    this._dirty = 0;
    this._loading = false;
    this._orientation = "portrait";
  }

  set fields(newValue) {
    this._fields = newValue;
    if (!newValue.sections) return;

    // Create a reactive property for every form field.
    this._initializeFormFieldProperties(newValue);
  }

  set values(newValue) {
    if (!newValue) return;

    // When an external actor (such as a  parent component, web socket)
    // provides new values, set them but preserve unsaved edits.
    this._initializeValuesPreservingEdits(newValue);
  }

  set _dirty(value) {
    // Adjust only if incoming value differs, also emit change event.
    if (this.__dirty !== value) {
      this.__dirty = value;
      this._dispatchEvent("dirty-change", { dirty: this._dirty });
    }
  }

  set _loading(value) {
    // Adjust only if incoming value differs, also emit change event.
    if (this.__loading !== value) {
      this.__loading = value;
      this._dispatchEvent("loading-change", { loading: this._loading });
    }
  }

  get fields() {
    return this._fields;
  }

  get values() {
    return this._values;
  }

  get _dirty() {
    return this.__dirty;
  }

  get _loading() {
    return this.__loading;
  }

  render() {
    if (!this.fields?.sections) return;

    return html`
      <sl-resize-observer @sl-resize=${debounce(this._handleResize, 300)}>
        <div class="dynamic-form-wrapper">
          ${this._generateOneOrManyForms(this.fields)}
        </div>
      </sl-resize-observer>
    `;
  }

  async updated(changedProperties) {
    await this._onUpdate(changedProperties);
  }
}

customElements.define("dynamic-form", DynamicForm);
