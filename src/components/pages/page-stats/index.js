import { LitElement, html, css, nothing, guard } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import { serialize } from '/vendor/@shoelace/cdn@2.14.0/utilities/form.js';
import { customElementsReady } from '/utils/custom-elements-ready.js';
import { asyncTimeout } from '/utils/timeout.js';

class SettingsView extends LitElement {

  static get properties() {
    return {
      data: { type: Object },
      fields: { type: Object },
      _store: { type: Object, state: true },
      _saving: { type: Boolean, state: true },
      _saved: { type: Boolean, state: true },
      _showBanner: { type: Boolean, state: true }
    };
  }

  constructor() {
    super();
    this.store = {}
    this._saving = false;
    this._saved = false;
    this._showBanner = false;
    
    this.fields = {
      first_name: { propType: String, fieldType: 'text', label: 'First Name', required: true },
      last_name: { propType: String, fieldType: 'text', label: 'Last Name' },
      age: { propType: Number, fieldType: 'number', label: 'Age' },
      terms: { propType: Boolean, fieldType: 'checkbox', label: 'I ticked this box' },
    }
    
    this.data = { 
      first_name: 'John', 
      last_name: 'Doe',
      age: 30,
      terms: false,
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('form-dirty-change', this.handleDirtyChange)
    this.addEventListener('form-submit-success', this.handleFormSuccessEvent)
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('form-dirty-change', this.handleDirtyChange)
    this.removeEventListener('form-submit-success', this.handleFormSuccessEvent)
  }

  handleDirtyChange(event) {
    this._showBanner = event.detail.dirty
  }

  async handleFormSuccessEvent(event) {
    this._saved = true;
    await asyncTimeout(2000);
    this._saved = false;
  }

  async saveThing(data) {
    // Update SettingsView internal copy of data.
    this._saving = true;
    this.store = { ...this.store, ...data }
    console.log('SettingsView internal state updated, this wont have any side affects (yet)');

    await asyncTimeout(2000);
    
    // Update the data provided to the dynamic form.
    console.log('But when we do this, it will affect things.')
    this.data = { ...this.data, ...this.store };

    // Reset saving state
    this._saving = false;
  }

  render() {
    return html`
      <div style="padding:3em; max-width: 400px;">
        <div style="display: flex; align-items: center; gap: 1em;">
          <h1>MyForm</h1>
          ${this._showBanner && (!this._saving && !this._saved) ? html`
            <sl-tag variant="warning" pill>Unsaved changes</sl-tag>
          ` : nothing }
          ${this._showBanner && this._saving ? html`
            <sl-tag variant="primary" pill>Saving...</sl-tag>
          ` : nothing }
          ${this._saved ? html`
            <sl-tag variant="success" pill>Saved</sl-tag>
          ` : nothing }
        </div>
        ${guard([this.data, this.fields], () => html`
          <my-form
            .data=${this.data}
            .fields=${this.fields}
            .onSubmit=${this.saveThing.bind(this)}>
          </my-form>
        `)}
      </div>
    `;
  }
}

customElements.define('stats-view', SettingsView);

class MyForm extends LitElement {
  static get properties() {
    return {
      data: { type: Object },
      fields: { type: Object },
      onSubmit: { type: Object },
      _dirty: { type: Boolean, state: true },
      _loading: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();
    this.data = {};
    this.fields = {};
    this._dirty = false;
    this._loading = false;
  }

  set fields(newValue) {
    this._fields = newValue;

    // Dynamically create properties per field.
    // This approach allows each form field’s value to be directly bound to a unique reactive property,
    // facilitating automatic updates and rendering when field values change.
    // This avoids the complexity and limitations of tracking changes within an object 
    // (e.g., this.data.foo), which can lead to suboptimal reactivity and update detection in Lit.
    Object.keys(newValue).forEach(field => {
      const propertyOptions = { type: newValue[field].propType };

      // Create the standard property
      this.constructor.createProperty(field, propertyOptions);
      
      // Create the prefixed property (used for change tracking)
      const prefixedField = `__${field}`;
      this.constructor.createProperty(prefixedField, propertyOptions);

      // Initialize the properties with data
      if (this.data[field] !== undefined) {
        this[field] = this.data[field];
        this[prefixedField] = this.data[field];
      }
    });

    this.requestUpdate();
  }

  get fields() {
    return this._fields;
  }

  set _dirty(value) {
    if (this.__dirty !== value) {
      this.__dirty = value;
      this.dispatchEvent(new CustomEvent('form-dirty-change', {
        detail: { dirty: this._dirty },
        composed: true,
        bubbles: true
      }));
    }
  }

  get _dirty() {
    return this.__dirty;
  }

  handleResetClick(event) {
    event.preventDefault();
    // Reset to initial data state
    Object.keys(this.fields).forEach(field => {
      this[field] = this.data[field];
      this[`__${field}`] = this.data[field];
    });
    this._dirty = false;
    this.requestUpdate();
  }

  async handleSubmitEvent(event) {
    event.preventDefault();

    this._loading = true;

    // Collect data
    let formData = {};
    Object.keys(this.fields).forEach(field => {
      formData[field] = this[field];
    });

    // Call provided submit function
    await this.onSubmit(formData).catch((err) => {
      // ## ON FAIL:
      console.warn('form submission failed with err:', err)
      this._loading = false;
      return; // exit early. form must remain in current state.
    })

    // ## ON SUCCESS:

    // Sync the prefixed properties
    Object.keys(this.fields).forEach(field => {
      this[`__${field}`] = this[field];
    });

    this._loading = false;
    this._dirty = false;

    this.dispatchEvent(new CustomEvent('form-submit-success', {
      detail: {},
      composed: true,
      bubbles: true
    }));
  }

  handleInput(event) {
    this[event.target.name] = event.target.value;
    this.checkForChanges(event.target.name, event.target.value)
  }

  handleToggle(event) {
    this[event.target.name] = event.target.checked;
    this.checkForChanges(event.target.name, event.target.checked)
  }

  checkForChanges(touchedProp, newValue) {
    // Quickly assert whether one field is dirty, if so, set dirty and return.
    if (touchedProp && newValue && this[`__${touchedProp}`] !== newValue) {
      this._dirty = true;
      return;
    }

    // Test entire form
    let dirty = false;
    Object.keys(this.fields).forEach((field) => {
      if (this[`__${field}`] !== this[field]) {
        dirty = true;
      }
    });

    this._dirty = dirty;
  }

  async updated(changedProperties) {
    if (changedProperties.has('fields')) {
      // fields have been provided or updated
      // this is the moment to attach fresh event listeners.
      const form = this.shadowRoot.querySelector('form');
      form.removeEventListener('submit', this.handleSubmitEvent.bind(this));
      await customElementsReady(form);
      form.addEventListener('submit', this.handleSubmitEvent.bind(this));
    }
  }

  render() {
    return html`
      <form>
        ${Object.keys(this.fields).map(key => html`
          ${this.fields[key].fieldType === 'checkbox' ? html`
            <sl-checkbox
              name=${key}
              label=${key}
              type=${this.fields[key].fieldType}
              .value=${this[key]}
              ?checked=${this[key]}
              @sl-change=${this.handleToggle}>
              ${this.fields[key].label}
            </sl-checkbox>
            <br>
          ` : nothing }

          ${this.fields[key].fieldType !== 'checkbox' ? html`
            <sl-input
              name=${key}
              label=${this.fields[key].label}
              type=${this.fields[key].fieldType}
              .value=${this[key]}
              ?required=${this.fields[key].required}
              @input=${this.handleInput}>
            </sl-input>
          ` : nothing }

          <br>
        `)}

        <sl-button
          variant="primary"
          ?loading=${this._loading}
          type="submit">
            Submit
        </sl-button> 
        
        ${this._dirty
          ? html`
            <sl-button variant="text"
              @click=${this.handleResetClick}>
                Discard Changes
            </sl-button>`
          : nothing
        }
        <br>
      </form>
    `;
  }
}

customElements.define('my-form', MyForm);