import { html, ifDefined } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

const ifd = ifDefined

export function _render_color (field) {
  return html`
    <sl-color-picker
      name=${field.name}
      .value=${this[field.name]}
      ?disabled=${field.disabled}
      ?inline=${field.inline}
      ?opacity=${field.opacity}
      ?noFormatToggle=${field.opacity}
      ?uppercase=${field.uppercase}
      format=${ifd(field.format)}
      swatches=${ifd(field.swatches)}
      size=${ifd(field.size)}
      ?data-dirty-field=${this[this._dirtyFlagField(field.name)]}
      @sl-change=${this.handleChoice}>
    </sl-color-picker>
  `;
}
