export function _checkForChanges() {
  if (!this.fields?.sections) return;

  let dirty = 0;

  this.fields.sections.forEach((section) => {
    let sectionChangeCount = 0;

    section.fields.forEach((field) => {
      if (this._checkAndSetFieldDirtyStatus(field.name)) {
        sectionChangeCount++;
        dirty++;
      }
    });

    this[`_form_${section.name}_count`] = sectionChangeCount;
  });

  this._dirty = dirty;
}

export function _checkAndSetFieldDirtyStatus(fieldName) {
  const curr = this._getCurrent(fieldName)
  const orig = this._getOriginal(fieldName)
  const isDirty = curr !== orig

  this[this._dirtyFlagField(fieldName)] = isDirty;
  return isDirty;
}

export function _dirtyFlagField(fieldName) {
  return `__${fieldName}_is_dirty`
}

export function _dirtyFlagValue(fieldName) {
  return this[this._dirtyFlagField(fieldName)];
}

export function _getOriginal(fieldName) {
  return this[`__${fieldName}`]
}

export function _getCurrent(fieldName) {
  return this[fieldName]
}