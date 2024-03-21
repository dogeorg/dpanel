import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import checkbox from './fields/checkbox.js';

class DynamicForm extends LitElement {

  static styles = css`
    form {
      max-width: 400px;
    }

    .form-control {
      margin-bottom: 1.5em;
    }
  `

  render() {
    const formFields = formDefinition.fields.map(field => {

      let content = ''

      switch (field.type) {
        case 'text':
          content = html`
            <sl-input
              type="text"
              name=${field.name}
              label=${field.label}
              placeholder=${field.placeholder}
              help-text=${field.help}
              minlength=${field.minLength}
              maxlength=${field.maxLength}
              pattern=${field.pattern}
              ?clearable=${field.clearable}
              ?required=${field.required}
              >
            </sl-input>`;
            break;
        case 'select':
          content = html`
            <sl-select 
              name=${field.name}
              label=${field.label}
              placeholder=${field.placeholder}
              help-text=${field.help}
              ?clearable=${this.clearable}>
              ${field.options.map(option => html`
                <sl-option 
                  value=${option.value}>
                    ${option.label}
                </sl-option>`)}
            </sl-select>`;
            break;
        case 'range':
          content = html`
            <sl-range
              name=${field.name}
              label=${field.label}
              placeholder=${field.placeholder}
              help-text=${field.help}
              min=${field.min}
              max=${field.max}
              step=${field.step}>
            </sl-range>`;
            break;
        case 'date':
          content = html`
            <sl-input
              type="date"
              name=${field.name}
              label=${field.label}
              placeholder=${field.placeholder}
              help-text=${field.help}>
            </sl-input>`;
          break;
        case 'checkbox':
          content = checkbox(field)
          break;
      }
      return html`
        <div class="form-control">
          ${content}
        </div>
      `
    });

    return html`
      <form @submit="${this.handleSubmit}">
        ${formFields}
        <sl-button variant=warning type="submit">Submit</sl-button>
      </form>
    `;
  }

  handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    console.log(formData);
  }
}

customElements.define('dynamic-form', DynamicForm);

var formDefinition = {
  "fields": [
    {
      "type": "text",
      "name": "displayName",
      "label": "Display Name",
      "help": "> 3 characters, A-Z, numbers.",
      "placeholder": "Enter a display name",
      "clearable": true,
      "minLength": 3,
      "maxLength": 20,
      "pattern": "[A-Za-z]+",
      "required": true,
    },
    {
      "type": "select",
      "name": "favoriteColor",
      "label": "Favorite Color",
      "help": "Select your favourite colour",
      "clearable": true,
      "placeholder": "Is it red?",
      "options": [
        {"value": "red", "label": "Red"},
        {"value": "green", "label": "Green"},
        {"value": "blue", "label": "Blue"}
      ]
    },
    {
      "type": "range",
      "name": "happiness",
      "label": "Happiness level (0-5)",
      "min": 0,
      "max": 5,
      "step": 1
    },
    {
      "type": "date",
      "name": "dateOfBirth",
      "label": "Date of Birth"
    },
    {
      "type": "checkbox",
      "name": "ftw",
      "label": "I like Doge",
      "checked": false,
      "required": true
    },
  ]
};