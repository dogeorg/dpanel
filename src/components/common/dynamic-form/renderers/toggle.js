import { html, ifDefined } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

const ifd = ifDefined

export const toggle = function(field) {
  return html`
    <sl-switch
      name=${field.name}
      ?checked=${field.checked}
      ?disabled=${field.disabled}
      ?required=${field.required}
      size=${ifd(field.size)}
      help-text=${ifd(field.helpText)}>
      ${field.label}
    </sl-switch>
  `;
}
