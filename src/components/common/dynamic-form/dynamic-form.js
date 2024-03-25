import { LitElement, html, css, ifDefined } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import { serialize } from '/vendor/@shoelace/cdn@2.14.0/utilities/form.js';
import * as i from '/components/common/dynamic-form/renderers/index.js'
import { customElementsReady } from '/utils/custom-elements-ready.js';

class DynamicForm extends LitElement {

  static get properties() {
    return {
      data: { type: Object },
      activeFormId: { type: String }
    };
  }

  static styles = css`
    form {
      max-width: 480px;
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
  `;

  constructor() {
    super();
    this.formValid = true;
    this.activeFormId = null;
  }

  createSingleForm(data) {
    if (!data) return;
    if (!data.fields) return;
    return html`
      <form id="primary" action="/submit-form" method="post">
        ${data.fields.map(field => this.generateField(field))}
        <div class="footer-controls">
          <sl-button variant=warning type="submit" form="primary">Submit</sl-button>
        </div>
      </form>
    `;
  }

  createMultipleForms(data) {
    const placement = data.ui === 'vertical' ? 'start' : 'top';
    const tabs = data.sets.map((set) => {
      return html`
        <sl-tab @click=${() => this.handleTabChange(set.name)} slot="nav" panel="${set.name}">
          ${set.label}
        </sl-tab>
      `
    });

    const panels = data.sets.map((set) => {
      return html`
        <sl-tab-panel name="${set.name}">
          <form id=${set.name} action="/submit-form" method="post">
            ${set.fields.map(field => this.generateField(field))}
            <div class="footer-controls">
              ${this.data ? html`<sl-button variant=primary type="submit" form=${set.name}>Save</sl-button>`: '' }
            </div>
          </form>
        </sl-tab-panel>
      `
    });

    return html`
      <sl-tab-group placement=${ifDefined(placement)}>
        ${tabs}
        ${panels}
      </sl-tab-group>
    `
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
    if (!this.data) return;
    return this.data.sets
      ? this.createMultipleForms(this.data)
      : this.createSingleForm(this.data)
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

  _formSubmitListener = (event) => {
    event.preventDefault();
    const form = this.shadowRoot.querySelector(`form#${this.activeFormId}`);
    const data = serialize(form);
    console.log('Submitting ..', data);
  };

  _attachFormSubmitListener(form) {
    form.addEventListener('submit', this._formSubmitListener);
  }

  _removeFormSubmitListeners() {
    // Remove event listeners from all forms.
    const forms = this.shadowRoot.querySelectorAll('form');
    forms.forEach((form) => {
      form.removeEventListener('submit', this._formSubmitListener);
    });
  }

  disconnectedCallback() {
    this._removeFormSubmitListeners();
  }
}

customElements.define('dynamic-form', DynamicForm);
