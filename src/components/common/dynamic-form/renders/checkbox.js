import { html } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

export const checkbox = function(field, value) {
  return html`<sl-checkbox
    name=${field.name}
    ?checked=${valueParser(value)}
    ?disabled=${field.disabled}
    ?indeterminate=${field.indeterminate}
    ?required=${field.required}
    ?defaultChecked=${field.defaultChecked}>
    ${field.label}
  </sl-checkbox>
  `;
}

function valueParser(value = false) {
  if (value === "false") return false;
  if (value === "off") return false;
  if (value === "0") return false;
  return Boolean(value);
}