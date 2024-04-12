import { html, ifDefined } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

const ifd = ifDefined

// TODO. Bug. Value is not being included in serialized form data.

export const rating = function(field, values) {
  return html`
    <sl-rating
      name=${field.name}
      value=${ifd(values[field.name])}
      label=${ifd(field.label)}
      max=${ifd(field.max)}
      precision=${ifd(field.precision)}
      ?disabled=${field.disabled}
      ?readonly=${field.readonly}>
    </sl-rating>
  `;
}
