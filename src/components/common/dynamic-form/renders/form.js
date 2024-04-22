import { html, nothing, repeat } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

export function _generateOneOrManyForms(data) {
  const tabs = data.sections.map((section, index) => {
    const changeCount = this[`_form_${section.name}_count`];
    return html`
      <sl-tab
        @click=${(event ) => this._handleTabChange(event, section.name)}
        slot="nav"
        ?disabled=${this._loading}
        class="capitalize"
        panel="${section.name}">
          ${section.name}
          ${changeCount ? html`
            <sl-tag pill size="small" 
              class="tag-change-indicator" 
              variant="neutral"
            >${changeCount}` : nothing }
            </sl-tag>
      </sl-tab>
    `
  });

  const form = (section, index = 0) => {
    const formFields = repeat(section.fields, (field) => field.name, (field) => this._generateField(field))
    const formControls = this._generateFormControls({ formId: section.name, submitLabel: 'Save' })
    return html`
      <form id=${section.name}>
        ${formFields}
        ${formControls}
      </form>
    `
  }

  const panels = data.sections.map((section, index) => {
    return html`
      <sl-tab-panel name=${section.name}>
        ${form(section, index)}
      </sl-tab-panel>
    `
  });

  // if mutliple sections, render tabs and panels
  if (data.sections.length > 1)
  return html`
    <sl-tab-group 
      placement=${this._orientation === 'portrait' ? 'top' : 'start' }>
      ${tabs}
      ${panels}
    </sl-tab-group>
  `

  if (data.sections.length === 1) {
    return html`
      ${form(data.sections[0])}
    `
  }
}

export function _generateField(field) {
  try {
    if (field.hidden) return nothing;
    if (field.type === 'number') {
      return html`
        <div class="form-control">
          ${this[`_render_${field.type}`](field)}
        </div>
      `
    } else {
      return html`
        <div class="form-control">
          ${this[`_render_${field.type}`](field)}
        </div>
      `
    }
  } catch (fieldRenderError) {
    console.error('Dynamic form field error:', { field, fieldRenderError })
    return this._generateErrorField(field)
  } 
}

export function _generateErrorField(field) {
  return html`
    <div class="form-control render-error" no-collect>
      <sl-input
        label="Field Error"
        help-text="${field.type} is not a valid field type"
        value=${field.type}
        >
        <sl-icon name="exclamation-diamond" slot="prefix"></sl-icon>
      </sl-input>
    </div>
  `
}

export function _generateFormControls(options = {}) {
  const changeCount = this[`_form_${options.formId}_count`];
  return html`
    <div class="footer-controls">
      ${changeCount ? html`
        <sl-button
          variant="text"
          id="${options.formId}__reset_button"
          @click=${this._handleDiscardChanges}>
            Discard changes
        </sl-button>
      ` : nothing }

      <sl-button
        id="${options.formId}__save_button"
        variant=primary
        type="submit"
        ?loading=${this._loading}
        ?disabled=${!changeCount}
        form=${options.formId}>
      ${options.submitLabel || 'Save' }
    </sl-button>
    </div>
  `
}