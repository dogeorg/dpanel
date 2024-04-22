import { html, ifDefined } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

const ifd = ifDefined

export function _render_select(field) {
  return html`
    <sl-select
      name=${field.name}
      label=${ifd(field.label)}
      .value=${this[field.name]}
      placeholder=${ifd(field.placeholder)}
      ?multiple=${field.multiple}
      size=${ifd(field.size)}
      maxOptionsVisible=${ifd(field.maxOptionsVisible)}
      ?hoist=${field.hoist}
      ?required=${field.required}
      ?clearable=${field.clearable}
      ?disabled=${field.disabled}
      ?data-dirty-field=${this[this._dirtyFlagField(field.name)]}
      @sl-change=${this._handleChoice}>
      ${field.options.map(option => html`
        <sl-option value=${option.value}>${option.label}</sl-option>
      `)}
    </sl-select>
  `;
}
