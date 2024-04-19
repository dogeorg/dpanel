import { html, ifDefined } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

const ifd = ifDefined

export function _render_range(field) {
  return html`
    <sl-range
      name=${field.name}
      label=${ifd(field.label)}
      .value=${this[field.name]}
      min=${ifd(field.min)}
      max=${ifd(field.max)}
      step=${ifd(field.step)}
      ?disabled=${field.disabled}
      ?showTooltip=${field.showTooltip}
      ?data-dirty-field=${this[this._dirtyFlagField(field.name)]}
      @sl-change=${this.handleChoice}>
    </sl-range>
  `;
}

// TODO: Works with numbers. Change tracking struggles with strings.