import { html, ifDefined } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

const ifd = ifDefined

export const email = function(field, value) {
  return html`
    <sl-input
      type="email"
      name=${field.name}
      label=${ifd(field.label)}
      placeholder=${ifd(field.placeholder)}
      help-text=${ifd(field.help)}
      minlength=${ifd(field.minLength)}
      maxlength=${ifd(field.maxLength)}
      pattern=${ifd(field.pattern)}
      size=${ifd(field.size)}
      value=${ifd(value)}
      ?clearable=${field.clearable}
      ?required=${field.required}
      ?disabled=${field.disabled}
      >
    </sl-input>
  `;
}