import { html, ifDefined } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

const ifd = ifDefined

export function _render_number(field) {
  return html`
    <sl-input
      type="number"
      name=${field.name}
      label=${ifd(field.label)}
      placeholder=${ifd(field.placeholder)}
      help-text=${ifd(field.help)}
      min=${ifd(field.min)}
      max=${ifd(field.max)}
      step=${ifd(field.step)}
      size=${ifd(field.size)}
      .value=${this[field.name]}
      ?clearable=${field.clearable}
      ?noSpinButtons=${field.noSpinButtons}
      ?autofocus=${field.autofocus}
      ?required=${field.required}
      ?disabled=${field.disabled}
      ?data-dirty-field=${this[this._dirtyFlagField(field.name)]}
      @input=${this._handleInput}
      >
    </sl-input>
  `;
}

function valueParser(value) {
  return value.toString()
}