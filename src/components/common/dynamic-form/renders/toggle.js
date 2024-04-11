import { html, ifDefined } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

const ifd = ifDefined

export const toggle = function(field, values) {
  return html`
    <sl-switch
      name=${field.name}
      ?checked=${checkedParser(values[field.name])}
      value=${valueParser(values[field.name])}
      ?disabled=${field.disabled}
      ?required=${field.required}
      size=${ifd(field.size)}
      help-text=${ifd(field.helpText)}>
      ${field.label}
    </sl-switch>
  `;
}

// This determines whether the box is in a checked or unchecked state visually.
function checkedParser(value = false) {
  if (value === "false") return false;
  if (value === "off") return false;
  if (value === "0") return false;
  if (value === "-1") return false;
  return Boolean(value);
}

// This determines what the input value is when retrieved at form submission
function valueParser(value) {
  if (value === "false") return "off";
  if (value === "off") return "off";
  if (value === "0") return "off";
  if (value === "-1") return "off";
  return Boolean(value) ? "on" : "off";
}