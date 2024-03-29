import { LitElement, html, css, ifDefined } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import { serialize } from '/vendor/@shoelace/cdn@2.14.0/utilities/form.js';
import * as i from '/components/common/dynamic-form/renderers/index.js'
import { customElementsReady } from '/utils/custom-elements-ready.js';
import { postConfig } from '/api/config/config.js';

class DynamicForm extends LitElement {

  static get properties() {
    return {
      data: { type: Object },
      activeFormId: { type: String },
      isSubmitting: { type: Boolean },
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
  `;

  constructor() {
    super();
    this.formValid = true;
    this.activeFormId = null;
  }

  createFormControls(options = {}) {
    return html`
      <div class="footer-controls">
        <sl-button
          id="${options.formId}__save_button"
          variant=primary
          type="submit"
          form=${options.formId}
          ?loading=${this.isSubmitting}>
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
          @click=${() => this.handleTabChange(sectionId)}
          slot="nav"
          panel="${sectionId}">
            ${section.label || sectionId}
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
      if (field.hidden) return '';
      return html`
        <div class="form-control">
          ${i[field.type](field)}
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
    if (!this.data || !this.data.sections) return;
    return this.createMultipleForms(this.data)
  }

  handleTabChange(tabName) {
    this.activeFormId = tabName;
    this.requestUpdate();
  }

  async updated(changedProperties) {
    // Check if `data` OR 'activeFormId' is the property that changed

    const dataInitialized = changedProperties.has('data') && !changedProperties.has('activeFormId')

    if (changedProperties.has('data') || changedProperties.has('activeFormId')) {
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

  // Helper function to create and display toasts imperatively
  createToast(variant, message, icon = 'info-circle', duration = 3000) {
    const alert = document.createElement('sl-alert');
    alert.variant = variant;
    alert.closable = true;
    alert.duration = duration;
    alert.innerHTML = `
      <sl-icon name="${icon}" slot="icon"></sl-icon>
      ${this.escapeHtml(message)}
    `;
    document.body.append(alert);
    alert.toast();
  }

  // Utility function to escape HTML
  escapeHtml(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }

  _formSubmitHandler = async (event) => {
    event.preventDefault();
    this.isSubmitting = true;
    try {
      // Collect data
      const form = this.shadowRoot.querySelector(`form#${this.activeFormId}`);
      const data = serialize(form);

      // Submit data
      const res = await postConfig(data);
      console.log('Response.. ', res);
    } catch (error) {

      // Display errors
      this.createToast('danger', `Error: ${error.message}`);
      console.error('Submission error', error);

    } finally {
      // Celebrate successs.
      this.isSubmitting = false;
      const saveButton = this.shadowRoot.querySelector(`form#${this.activeFormId} sl-button[type="submit"]`);
      const buttonOriginalText = saveButton.textContent;
      saveButton.textContent = 'Done';
      saveButton.disabled = true;

      setTimeout(function () {
        saveButton.textContent = buttonOriginalText;
        saveButton.disabled = false;
      }, 1400);
    }
  };

  _attachFormSubmitListener(form) {
    form.addEventListener('submit', this._formSubmitHandler);
  }

  _removeFormSubmitListeners() {
    // Remove event listeners from all forms.
    const forms = this.shadowRoot.querySelectorAll('form');
    forms.forEach((form) => {
      form.removeEventListener('submit', this._formSubmitHandler);
    });
  }

  disconnectedCallback() {
    this._removeFormSubmitListeners();
  }
}

customElements.define('dynamic-form', DynamicForm);
