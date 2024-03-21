import { html } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

export default function checkbox(field) {
  return html`<sl-checkbox
    name=${field.name}
    ?checked=${field.checked}
    ?disabled=${field.disabled}
    ?indeterminate=${field.indeterminate}
    ?required=${field.required}>
    ${field.label}
  </sl-checkbox>`
}