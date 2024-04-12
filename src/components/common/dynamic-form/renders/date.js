import { html, ifDefined } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

const ifd = ifDefined

export const date = function(field, values) {
  return html`
    <sl-input
      type="date"
      name=${field.name}
      label=${ifd(field.label)}
      placeholder=${ifd(field.placeholder)}
      help-text=${ifd(field.help)}
      min=${ifd(field.minDate)}
      max=${ifd(field.maxDate)}
      size=${ifd(field.size)}
      value=${ifd(values[field.name])}
      ?clearable=${field.clearable}
      ?required=${field.required}
      ?disabled=${field.disabled}
      >
    </sl-input>
  `;
}