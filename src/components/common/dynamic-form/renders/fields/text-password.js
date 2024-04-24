import { html, ifDefined } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

const ifd = ifDefined

export function _render_password(field) {
  const { currentKey, isDirtyKey } = this.propKeys(field.name);
  return html`
    <sl-input
      type="password"
      name=${field.name}
      label=${ifd(field.label)}
      placeholder=${ifd(field.placeholder)}
      help-text=${ifd(field.help)}
      minlength=${ifd(field.minLength)}
      maxlength=${ifd(field.maxLength)}
      pattern=${ifd(field.pattern)}
      size=${ifd(field.size)}
      .value=${this[currentKey]}
      ?clearable=${field.clearable}
      ?required=${field.required}
      ?disabled=${field.disabled}
      ?password-toggle=${field.passwordToggle}
      ?data-dirty-field=${this[isDirtyKey]}
      @input=${this._handleInput}
      >
    </sl-input>
  `;
} 
