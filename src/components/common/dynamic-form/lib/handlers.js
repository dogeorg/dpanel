
export function _handleResize(event) {
  const width = event.detail.entries[0].contentRect.width;
  this._orientation = width >= 680 ? 'landscape' : 'portrait';
}

export function _handleInput(event) {
  this[event.target.name] = event.target.value;
  this._checkForChanges(event.target.name, event.target.value)
}

export function _handleToggle(event) {
  this[event.target.name] = event.target.checked;
  this._checkForChanges(event.target.name, event.target.checked)
}

export function _handleChoice(event) {
  this[event.target.name] = event.target.value;
  this._checkForChanges(event.target.name, event.target.value)
}

export function _handleTabChange(event, tabName) {
  this._activeFormId = tabName;
}

export function _handleDiscardChanges(event) {
  event.preventDefault();

  // Reset fields of active form to initial data state
  const modifiedFieldNodes = this.shadowRoot.querySelectorAll(`#${this._activeFormId} [data-dirty-field]`)
  Array
    .from(modifiedFieldNodes)
    .map(node => node.name)
    .forEach(fieldName => this[fieldName] = this[`__${fieldName}`])

  this._checkForChanges();
}

export function _attachFormSubmitListener(form) {
  form.addEventListener('submit', this._handleSubmit.bind(this));
}

export function _removeFormSubmitListeners() {
  // Remove event listeners from all forms.
  const forms = this.shadowRoot.querySelectorAll('form');
  forms.forEach((form) => {
    form.removeEventListener('submit', this._handleSubmit.bind(this));
  });
}