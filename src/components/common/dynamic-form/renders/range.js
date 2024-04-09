import { html, ifDefined } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

const ifd = ifDefined

export const range = function(field, value) {
  return html`
    <sl-range
      name=${field.name}
      label=${ifd(field.label)}
      value=${ifd(value)}
      min=${ifd(field.min)}
      max=${ifd(field.max)}
      step=${ifd(field.step)}
      ?disabled=${field.disabled}
      ?showTooltip=${field.showTooltip}>
    </sl-range>
  `;
}
