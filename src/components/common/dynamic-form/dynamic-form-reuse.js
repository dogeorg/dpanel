import { LitElement, html, css, ifDefined, nothing, repeat } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import { serialize } from '/vendor/@shoelace/cdn@2.14.0/utilities/form.js';
import * as inputRenderMethods from '/components/common/dynamic-form/renders/index.js'
import { bindToClass } from '/utils/class-bind.js';
import { createAlert } from '/components/common/alert.js';
import { customElementsReady } from '/utils/custom-elements-ready.js';
import { asyncTimeout } from '/utils/timeout.js';

class DynamicForm extends LitElement {

  static get properties() {
    return {
      values: { type: Object },
      fields: { type: Object },
      onSubmit: { type: Object },

      // State
      _activeFormId: { type: String, state: true },
      _dirty: { type: Number, state: true },
      _loading: { type: Boolean, state: true },

      // Presentation
      orientation: { type: String, reflect: true }
    };
  }

  static styles = css`
    form {
      padding-left: 1em;
    }
    .form-control {
      margin-bottom: 1.5em;
    }

    .form-control.render-error sl-input::part(form-control-label),
    .form-control.render-error sl-input::part(form-control-help-text) {
      color: tomato;
    }

    .footer-controls {
      display: flex;
      justify-content: flex-end;
    }

    sl-tab.capitalize::part(base) {
      text-transform: capitalize;
    }
    [data-dirty-field]::part(form-control-label) {
      position: relative;
    }
    [data-dirty-field]::part(form-control-label)::before,
    [data-dirty-field]::part(label)::before {
      content: "~";
      color: var(--sl-color-neutral-500);
      display: inline-block;
      position: absolute;
      left: -1rem;
    }
  `;

  constructor() {
    super();
    this.values = {};
    this.fields = {};

    this.formValid = true;
    this._activeFormId = null;
    this._dirty = 0;
    this._loading = false;

    bindToClass(inputRenderMethods, this)
  }

  set fields(newValue) {
    this._fields = newValue;
    if (!newValue.sections) return;

    // Create a reactive property for every form field.
    this.initializeFormFieldProperties(newValue)
  }

  get fields() {
    return this._fields;
  }

  set values(newValue) {
    if (!newValue) return;

    let _newValue = {}
    // When dynamic-form is provided new values via an external actor
    // We should not immediately adopt them as the user may have edits.
    // Preserve edits.
    Object.keys(newValue).forEach(key => {
      if (this[this._dirtyFlagField(key)]) {
        // If the field is dirty, retain the current value
        _newValue[key] = this[key]
      } else {
        // If the field is not dirty, update it with the new value
        this[key] = newValue[key];
        this[`__${key}`] = newValue[key];
        _newValue[key] = newValue[key]
      }
    });

    this._values = _newValue;
  }

  get values() {
    return this._values;
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

  get _loading() {
    return this.__loading;
  }

  set _loading(value) {
    if (this.__loading !== value) {
      this.__loading = value;
      this.dispatchEvent(new CustomEvent('form-loading-change', {
        detail: { loading: this._loading },
        composed: true,
        bubbles: true
      }));
    }
  }

  createFormControls(options = {}) {
    const changeCount = this[`_form_${options.formId}_count`];
    return html`
      <div class="footer-controls">
        ${changeCount ? html`
          <sl-button
            variant="text"
            id="${options.formId}__reset_button"
            @click=${this.handleDiscardChanges}>
              Discard changes
          </sl-button>
        ` : nothing }

        <sl-button
          id="${options.formId}__save_button"
          variant=primary
          type="submit"
          ?loading=${this._loading}
          ?disabled=${!changeCount}
          form=${options.formId}>
        ${options.submitLabel || 'Save' }
      </sl-button>
      </div>
    `
  }

  createMultipleForms(data) {
    const tabs = data.sections.map((section, index) => {
      const changeCount = this[`_form_${section.name}_count`];
      return html`
        <sl-tab
          @click=${(event ) => this.handleTabChange(event, section.name)}
          slot="nav"
          ?disabled=${this._loading}
          class="capitalize"
          panel="${section.name}">
            ${section.name}&nbsp;&nbsp;
            <sl-tag pill size="small" variant="neutral"
              style="${changeCount ? 'visibility: visible;' : 'visibility: hidden;'}"
            >${changeCount}
              </sl-tag>
        </sl-tab>
      `
    });

    const form = (section, index = 0) => {
      const formFields = repeat(section.fields, (field) => field.name, (field) => this.generateField(field))
      const formControls = this.createFormControls({ formId: section.name, submitLabel: 'Save' })
      return html`
        <form id=${section.name}>
          ${formFields}
          ${formControls}
        </form>
      `
    }

    const panels = data.sections.map((section, index) => {
      return html`
        <sl-tab-panel name=${section.name}>
          ${form(section, index)}
        </sl-tab-panel>
      `
    });

    // if mutliple sections, render tabs and panels
    if (data.sections.length > 1)
    return html`
      <sl-tab-group placement=${this.orientation === 'landscape' ? 'start' : 'top' }>
        ${tabs}
        ${panels}
      </sl-tab-group>
    `

    if (data.sections.length === 1) {
      return html`
        ${form(data.sections[0])}
      `
    }
  }

  generateField(field) {
    try {
      if (field.hidden) return nothing;
      if (field.type === 'number') {
        return html`
          <div class="form-control">
            ${this[`_render_${field.type}`](field)}
          </div>
        `
      } else {
        return html`
          <div class="form-control">
            ${this[`_render_${field.type}`](field)}
          </div>
        `
      }
    } catch (fieldRenderError) {
      console.error('Dynamic form field error:', { field, fieldRenderError })
      return this.generateErrorField(field)
    } 
  }

  generateErrorField(field) {
    return html`
      <div class="form-control render-error" no-collect>
        <sl-input
          label="Field Error"
          help-text="${field.type} is not a valid field type"
          value=${field.type}
          >
          <sl-icon name="exclamation-diamond" slot="prefix"></sl-icon>
        </sl-input>
      </div>
    `
  }

  render() {
    if (!this.fields || !this.fields.sections) return;
    return this.createMultipleForms(this.fields)
  }

  handleInput(event) {
    this[event.target.name] = event.target.value;
    this._checkForChanges(event.target.name, event.target.value)
  }

  handleToggle(event) {
    this[event.target.name] = event.target.checked;
    this._checkForChanges(event.target.name, event.target.checked)
  }

  handleChoice(event) {
    this[event.target.name] = event.target.value;
    this._checkForChanges(event.target.name, event.target.value)
  }

  handleTabChange(event, tabName) {
    this._activeFormId = tabName;
  }

  async updated(changedProperties) {
    if (!this._shouldUpdateForm(changedProperties)) {
      return;
    }

    // Remove previous form submit listeners
    this._removeFormSubmitListeners();

    // Determine the appropriate form to target
    const form = this._getTargetForm(changedProperties);
    if (!form) {
        console.error("No form found.", changedProperties);
        return;
    }

    // Update the active form ID if necessary
    this._updateActiveFormId(form, changedProperties);

    // Ensure all custom elements within the form are fully defined
    await customElementsReady(form);

    // Attach a new submit listener to the form
    this._attachFormSubmitListener(form);
  }

  _shouldUpdateForm(changedProperties) {
    return changedProperties.has('fields') || changedProperties.has('_activeFormId');
  }

  _getTargetForm(changedProperties) {
    const isDataInitialization = changedProperties.has('fields') && 
        (!changedProperties.has('_activeFormId') || !this._activeFormId);

    const formSelector = isDataInitialization ? 'form' : `form#${this._activeFormId}`;
    return this.shadowRoot.querySelector(formSelector);
  }

  _updateActiveFormId(form, changedProperties) {
    const isDataInitialization = changedProperties.has('fields') &&
        (!changedProperties.has('_activeFormId') || !this._activeFormId);

    if (isDataInitialization) {
        this._activeFormId = form.id;
    }
  }

  handleDiscardChanges(event) {
    event.preventDefault();

    // Reset fields of active form to initial data state
    const modifiedFieldNodes = this.shadowRoot.querySelectorAll(`#${this._activeFormId} [data-dirty-field]`)
    Array
      .from(modifiedFieldNodes)
      .map(node => node.name)
      .forEach(fieldName => this[fieldName] = this[`__${fieldName}`])

    this._checkForChanges();
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    
    // Set submitting state
    this._loading = true;

    const modifiedFieldNodes = this.shadowRoot.querySelectorAll(`#${event.target.id} [data-dirty-field]`)

    // Collect data
    let formData = {};
    Array
      .from(modifiedFieldNodes)
      .map(node => node.name)
      .forEach(fieldName => formData[fieldName] = this[fieldName]);

    // // Attempt save.
    await this.onSubmit(formData).catch((err) => {
      // ## ON ERROR
      console.warn('Form submission failed:', err);
      this._loading = false;
      return;
    })

    // // ## ON SUCCESS
    console.log('Done submitting');

    // Sync the prefixed properties
    Object.keys(formData).forEach(field => {
      this[`__${field}`] = this[field];
    });

    // Reset
    this._loading = false;
    this._checkForChanges();

    this.dispatchEvent(new CustomEvent('form-submit-success', {
      detail: {},
      composed: true,
      bubbles: true
    }));
  }

  initializeFormFieldProperties(newValue) {
    newValue.sections.forEach((section) => {

      // For each section, create a property to track modified field count
      this.constructor.createProperty(`_form_${section.name}_count`, { type: Number });
      this[`_form_${section.name}_count`] = 0;

      section.fields.forEach(field => {
        const propertyOptions = { type: String };

        // Create the standard property
        this.constructor.createProperty(field.name, propertyOptions);

        // Create the prefixed property (used for change tracking)
        const prefixedField = `__${field.name}`;
        this.constructor.createProperty(prefixedField, propertyOptions);

        // Create a property for dirty tracking
        const dirtyFlagFieldName = `__${field.name}_is_dirty`;
        this.constructor.createProperty(dirtyFlagFieldName, { type: Boolean });

      });
    });
  }

  _checkForChanges() {
    if (!this.fields || !this.fields.sections) return;
    // Test entire form
    let dirty = 0;

    this.fields.sections.forEach((section) => {

      let sectionChangeCount = 0;

      section.fields.forEach(field => {
        if (this._checkAndSetFieldDirtyStatus(field.name)) {
          sectionChangeCount++
          dirty++
        }
      })

      // Update the section's change count tracker.
      this[`_form_${section.name}_count`] = sectionChangeCount;
    });

    this._dirty = dirty;
  }

  _attachFormSubmitListener(form) {
    form.addEventListener('submit', this.handleSubmit);
  }

  _removeFormSubmitListeners() {
    // Remove event listeners from all forms.
    const forms = this.shadowRoot.querySelectorAll('form');
    forms.forEach((form) => {
      form.removeEventListener('submit', this.handleSubmit);
    });
  }

  disconnectedCallback() {
    this._removeFormSubmitListeners();
  }

  _checkAndSetFieldDirtyStatus(fieldName) {
    const curr = this._getCurrent(fieldName)
    const orig = this._getOriginal(fieldName)
    const isDirty = curr !== orig

    this[this._dirtyFlagField(fieldName)] = isDirty;
    return isDirty;
  }

  _dirtyFlagField(fieldName) {
    return `__${fieldName}_is_dirty`
  }

  _dirtyFlagValue(fieldName) {
    return this[this._dirtyFlagField(fieldName)];
  }

  _getOriginal(fieldName) {
    return this[`__${fieldName}`]
  }

  _getCurrent(fieldName) {
    return this[fieldName]
  }
}

customElements.define('dynamic-form-reuse', DynamicForm);