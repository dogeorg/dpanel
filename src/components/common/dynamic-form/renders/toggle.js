import { html, ifDefined } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

const ifd = ifDefined

export const toggle = function(field, value) {
  return html`
    <sl-switch
      name=${field.name}
      ?checked=${valueParser(value)}
      ?disabled=${field.disabled}
      ?required=${field.required}
      size=${ifd(field.size)}
      help-text=${ifd(field.helpText)}>
      ${field.label}
    </sl-switch>
  `;
}

function valueParser(value = false) {
  if (value === "false") return false;
  if (value === "off") return false;
  if (value === "0") return false;
  return Boolean(value);
}