import { html, ifDefined } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

const ifd = ifDefined

export const select = function(field) {
  return html`
    <sl-select
      name=${field.name}
      label=${ifd(field.label)}
      value=${ifd(field.value)}
      placeholder=${ifd(field.placeholder)}
      ?multiple=${field.multiple}
      size=${ifd(field.size)}
      maxOptionsVisible=${ifd(field.maxOptionsVisible)}
      ?hoist=${field.hoist}
      ?required=${field.required}
      ?clearable=${field.clearable}
      ?disabled=${field.disabled}>
      ${field.options.map(option => html`
        <sl-option value=${option.value}>${option.label}</sl-option>
      `)}
    </sl-select>
  `;
}
