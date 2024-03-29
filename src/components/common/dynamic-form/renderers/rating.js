import { html, ifDefined } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

const ifd = ifDefined

export const rating = function(field) {
  return html`
    <sl-rating
      name=${field.name}
      value=${ifd(field.value)}
      label=${ifd(field.label)}
      max=${ifd(field.max)}
      precision=${ifd(field.precision)}
      ?disabled=${field.disabled}
      ?readonly=${field.readonly}>
    </sl-rating>
  `;
}
