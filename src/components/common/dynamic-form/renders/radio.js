import { html, ifDefined } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

const ifd = ifDefined

export const radio = function(field, values) {
  return html`
    <sl-radio-group
      name=${field.name}
      label=${ifd(field.label)}
      help-text=${ifd(field.help)}
      size=${ifd(field.size)}
      value=${ifd(values[field.name])}
    >
      ${field.options.map(option => html`
        <sl-radio
          value=${option.value}
          ?checked=${option.checked}
          ?disabled=${option.disabled}>
          ${option.label}
        </sl-radio>
      `)}
    </sl-radio-group>
  `;
}
