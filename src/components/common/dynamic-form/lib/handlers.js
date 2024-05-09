export function _handleResize(event) {
  const width = event.detail.entries[0].contentRect.width;
  this._orientation = width >= 680 ? "landscape" : "portrait";
}

export function _handleInput(event) {
  const { currentKey } = this.propKeys(event.target.name);
  this[currentKey] = event.target.value;
  this._checkForChanges(event.target.name, event.target.value);
}

export function _handleToggle(event) {
  const { currentKey } = this.propKeys(event.target.name);
  this[currentKey] = event.target.checked;
  this._checkForChanges(event.target.name, event.target.checked);
}

export function _handleChoice(event) {
  const { currentKey } = this.propKeys(event.target.name);
  this[currentKey] = event.target.value;
  this._checkForChanges(event.target.name, event.target.value);
}

export function _handleTabChange(event, tabName) {
  this._activeFormId = tabName;
}

export function _handleDiscardChanges(event) {
  event.preventDefault();

  // Reset fields of active form to initial data state
  const modifiedFieldNodes = this.shadowRoot.querySelectorAll(
    `#${this._activeFormId} [data-dirty-field]`,
  );
  Array.from(modifiedFieldNodes)
    .map((node) => node.name)
    .forEach((fieldName) => {
      const { currentKey, originalKey } = this.propKeys(fieldName);
      this[currentKey] = this[originalKey] || "";
    });

  this._checkForChanges();
}
