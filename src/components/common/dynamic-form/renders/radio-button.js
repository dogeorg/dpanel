import { html, ifDefined } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

const ifd = ifDefined

export const radioButton = function(field, values) {
  return html`
    <sl-radio-group
      label=${ifd(field.label)}
      help-text=${ifd(field.helpText)}
      name=${field.name}
      size=${ifd(field.size)}
      value=${ifd(values[field.name])}
      ?disabled=${field.disabled}
      ?required=${field.required}
    >
      ${field.options.map(
        (option) => html`
          <sl-radio-button
            value=${option.value}
            ?checked=${option.checked}
            ?disabled=${option.disabled}
          >
            ${option.label}
          </sl-radio-button>
        `
      )}
    </sl-radio-group>
  `;
}