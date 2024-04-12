import { html, ifDefined } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

const ifd = ifDefined

export const color = function(field, values) {
  return html`
    <sl-color-picker
      name=${field.name}
      value=${ifd(values[field.name])}
      ?disabled=${field.disabled}
      ?inline=${field.inline}
      ?opacity=${field.opacity}
      ?noFormatToggle=${field.opacity}
      ?uppercase=${field.uppercase}
      defaultValue=${ifd(field.defaultValue)}
      format=${ifd(field.format)}
      swatches=${ifd(field.swatches)}
      size=${ifd(field.size)}>
    </sl-color-picker>
  `;
}
