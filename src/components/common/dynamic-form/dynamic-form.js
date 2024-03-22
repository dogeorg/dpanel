import { LitElement, html, css, ifDefined } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import { serialize } from '/vendor/@shoelace/cdn@2.14.0/utilities/form.js';
import * as i from '/components/common/dynamic-form/fields/index.js'
const ifd = ifDefined;

class DynamicForm extends LitElement {

  static get properties() {
    return {
      data: { type: Object }
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

  createFormFields(data) {
    if (!data) return;

    // Handle inline form creation
    if (!data.type || data.type === 'inline') {
      return data.fields.map(field => this.generateField(field))
    }

    // Handle grouped form creation
    if (data.type && data.type === 'grouped') {

      console.log('HERE', data.sets);
      
      const placement = data.ui === 'vertical' ? 'start' : 'top';

      const tabs = data.sets.map((set) => {
        return html`
          <sl-tab slot="nav" panel="${set.name}">
            ${set.label}
          </sl-tab>
        `
      });

      const panels = data.sets.map((set) => {
        return html`
          <sl-tab-panel name="${set.name}">
            ${set.fields.map(field => this.generateField(field))}
          </sl-tab-panel>
        `
      });

      return html`
        <sl-tab-group placement=${ifd(placement)}>
          ${tabs}
          ${panels}
        </sl-tab-group>
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
    return html`
      <form @submit="${this.handleSubmit}">
        ${this.createFormFields(this.data)}
        <div class="footer-controls">
          ${this.data ? html`<sl-button variant=warning type="submit">Submit</sl-button>`: '' }
        </div>
      </form>
    `;
  }

  handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const data = serialize(form);
    console.log(data);
  }
}

customElements.define('dynamic-form', DynamicForm);