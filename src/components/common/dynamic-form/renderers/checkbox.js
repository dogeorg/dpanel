import { html } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

export const checkbox = function(field) {
  return html`<sl-checkbox
    name=${field.name}
    ?checked=${field.checked}
    ?disabled=${field.disabled}
    ?indeterminate=${field.indeterminate}
    ?required=${field.required}
    ?defaultChecked=${field.defaultChecked}>
    ${field.label}
  </sl-checkbox>
  `;
}
