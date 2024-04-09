import { html, ifDefined } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

const ifd = ifDefined

export const text = function(field, value) {
  return html`
    <sl-input
      type="text"
      name=${field.name}
      label=${ifd(field.label)}
      placeholder=${ifd(field.placeholder)}
      help-text=${ifd(field.help)}
      minlength=${ifd(field.minlength)}
      maxlength=${ifd(field.maxlength)}
      pattern=${ifd(field.pattern)}
      size=${ifd(field.size)}
      value=${ifd(value)}
      ?clearable=${field.clearable}
      ?required=${field.required}
      >
    </sl-input>
  `;
} 

