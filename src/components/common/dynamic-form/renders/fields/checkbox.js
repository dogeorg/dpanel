import { html } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

export function _render_checkbox(field) {
  const { currentKey, isDirtyKey } = this.propKeys(field.name);
  return html`<sl-checkbox
    name=${field.name}
    ?checked=${this[currentKey]}
    .value=${this[currentKey]}
    ?disabled=${field.disabled}
    ?indeterminate=${field.indeterminate}
    ?required=${field.required}
    ?data-dirty-field=${this[isDirtyKey]}
    @sl-change=${this._handleToggle}>
    ${field.label}
  </sl-checkbox>
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