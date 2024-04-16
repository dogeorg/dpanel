import { LitElement, html, css, ifDefined, nothing } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import { serialize } from '/vendor/@shoelace/cdn@2.14.0/utilities/form.js';
import * as i from '/components/common/dynamic-form/renders/index.js'
import { createAlert } from '/components/common/alert.js';
import { customElementsReady } from '/utils/custom-elements-ready.js';
import { postConfig } from '/api/config/config.js';
import { pkgController } from '/models/package/index.js';

class DynamicForm extends LitElement {

  static get properties() {
    return {
      // Context
      pupId: { type: String },
      activeFormId: { type: String },

      // Fields and values
      fields: { type: Object },
      values: { type: Object },

      // State
      submitting: { type: Boolean },
      dirty: { type: Boolean, reflect: true },

      // Presentation
      orientation: { type: String }
    };
  }

  static styles = css`
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

    .footer-controls sl-button.discard-button::part(base) {
      color: var(--sl-color-neutral-700);
      text-decoration: underline;
    }
    .footer-controls sl-button.discard-button::part(base):hover {
      color: var(--sl-color-neutral-900);
    }
    sl-tab.capitalize::part(base) {
      text-transform: capitalize;
    }
  `;

  constructor() {
    super();
    this.formValid = true;
    this.activeFormId = null;
    this.values = {};
    this.initialValues = {};
    this.dirty = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.initialValues = { ...this.values };
  }

  getFormValues() {
    const forms = this.shadowRoot.querySelectorAll('form');
    let out = {}
    forms.forEach((form) => {
      out = {
        ...out,
        ...superSerialize(form)
      }
    })
    return out
  }

  createFormControls(options = {}) {
    return html`
      <div class="footer-controls">
        ${this.dirty ? html`
          <sl-button
            class="discard-button"
            variant="text"
            @click=${this.handleClearChanges}>
              Discard changes
          </sl-button>
        ` : nothing
        }
        <sl-button
          id="${options.formId}__save_button"
          variant=primary
          type="submit"
          form=${options.formId}
          ?loading=${this.submitting}
          ?disabled=${!this.dirty}>
        ${options.submitLabel || 'Save' }
      </sl-button>
      </div>
    `
  }

  createMultipleForms(data) {
    const tabs = data.sections.map((section, index) => {
      const sectionId = `${(section.name || "default")}_${index}`;
      return html`
        <sl-tab
          @click=${(event ) => this.handleTabChange(event, sectionId)}
          slot="nav"
          class="capitalize"
          panel="${sectionId}">
            ${section.name}
        </sl-tab>
      `
    });

    const form = (section, index = 0) => {
      const sectionId = `${(section.name || "default")}_${index}`;
      return html`
        <form id=${sectionId}>
          ${section.fields.map(field => this.generateField(field))}
          ${this.createFormControls({ formId: sectionId, submitLabel: 'Save' })}
        </form>
      `
    }

    const panels = data.sections.map((section, index) => {
      const sectionId = `${(section.name || "default")}_${index}`;
      return html`
        <sl-tab-panel name=${sectionId}>
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
      return html`
        <div class="form-control">
          ${i[field.type](field, this.values)}
        </div>
      `
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

  handleTabChange(event, tabName) {
    this.activeFormId = tabName;
    this.requestUpdate();
  }

  async updated(changedProperties) {
    // Check if `data` OR 'activeFormId' is the property that changed
    const dataInitialized = changedProperties.has('fields') 
      && (!changedProperties.has('activeFormId') || !changedProperties.activeFormId)

    if (changedProperties.has('fields') || changedProperties.has('activeFormId')) {
      // The `dataSet` has been initialized or updated OR, the activeFormId has changed, both
      // result in some number of shoelace components being added to the DOM. 
      
      // Remove previous listeners
      this._removeFormSubmitListeners();

      // Determine form
      const form = dataInitialized
        ? this.shadowRoot.querySelector(`form`)
        : this.shadowRoot.querySelector(`form#${this.activeFormId}`);

      if (!form) {
        return;
      }

      // Set the activeFormId when initliazing or changing data alone.
      if (dataInitialized) { this.activeFormId = form.id }

      // Wait for new elements to be ready
      await customElementsReady(form);

      // Do things knowing all custom-elements are ready.
      this._attachFormSubmitListener(form);
    }
  }

  handleFormChange = () => {
    const currentValues = this.getFormValues();
    const newDirty = !this.areValuesEqual(this.initialValues, currentValues);
    // Check if the dirty state has changed
    if (newDirty !== this.dirty) {
      // Update the dirty state
      this.dirty = newDirty;
      // Emit the dirty-change event with the new state
      this.dispatchEvent(new CustomEvent('dirty-change', {
        detail: { dirty: this.dirty },
        composed: true
      }));
    }
  }

  handleClearChanges() {
    this.resetForm()
  }

  resetForm(newState) {
    if (newState) {
      this.initialValues = { ...this.initialValues, ...newState };
    }

    // Reset the values to their initial state
    if (!newState) {
      const forms = this.shadowRoot.querySelectorAll('form');
      forms.forEach(form => form.reset());
      this.values = { ...this.initialValues };
    }

    // Update the dirty flag
    this.dirty = false;
    this.dispatchEvent(new CustomEvent('dirty-change', {
      detail: { dirty: this.dirty },
      composed: true
    }));
  }

  areValuesEqual(objectA, objectB) {
    if (!objectA || !objectB) return false;
    const keysA = Object.keys(objectA);
    const keysB = Object.keys(objectB);

    // Check if both objects have the same number of properties
    if (keysA.length !== keysB.length) {
      return false;
    }

    // Check if values for each property are the same
    for (const key of keysA) {
      if (objectA[key] !== objectB[key]) {
        return false;
      }
    }

    return true;
  }

  _formSubmitHandler = async (event) => {
    event.preventDefault();
    this.submitting = true;
    try {
      // Collect data
      const form = this.shadowRoot.querySelector(`form#${this.activeFormId}`);
      const data = superSerialize(form);

      // Submit data
      const res = await postConfig(this.pupId, data);

      // Update local model.
      pkgController.savePupChanges(this.pupId, data);

      // Celebrate successs.
      this.submitting = false;
      const saveButton = this.shadowRoot.querySelector(`form#${this.activeFormId} sl-button[type="submit"]`);
      const buttonOriginalText = saveButton.textContent;
      saveButton.textContent = 'Done';
      saveButton.disabled = true;

      setTimeout(function () {
        saveButton.textContent = buttonOriginalText;
        saveButton.disabled = false;
      }, 1400);

      // Reset form
      this.resetForm(data);

    } catch (error) {

      // Display errors
      createAlert('danger', `Error: ${error.message}`);
      console.error('Submission error', error);

    }
  };

  _attachFormSubmitListener(form) {
    form.addEventListener('submit', this._formSubmitHandler);
    form.addEventListener('sl-change', this.handleFormChange);
  }

  _removeFormSubmitListeners() {
    // Remove event listeners from all forms.
    const forms = this.shadowRoot.querySelectorAll('form');
    forms.forEach((form) => {
      form.removeEventListener('submit', this._formSubmitHandler);
      form.removeEventListener('sl-change', this.handleFormChange);
    });
  }

  disconnectedCallback() {
    this._removeFormSubmitListeners();
  }
}

// superSerialize performs one extra step after form serialization.
// when a user toggles a checkbox from checked to unchecked, shoelace serialize
// does not include that form field within its serialized object.
// Therefore, superSerialize inspects all toggles and checkboxes and
// explicitly sets their state as "on" or "off".
function superSerialize(form) {
  let data = serialize(form)
  const toggles = form.querySelectorAll('sl-switch') || [];
  const checkboxes = form.querySelectorAll('sl-checkbox') || [];

  [...toggles, ...checkboxes].forEach(tog => {
    if (!data[tog.name]) {
      const value = tog.checked ? 'on' : 'off';
      data[tog.name] = value
    }
  });

  return data
}

customElements.define('dynamic-form', DynamicForm);
