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
  const { currentKey, originalKey, isDirtyKey } = this.propKeys(fieldName);

  // Replace undefined with an empty string for comparison
  // to handle the situation where a user has backspaced an input to "".
  const curr = this[currentKey] ?? "";
  const orig = this[originalKey] ?? "";
  const isDirty = curr !== orig;

  // Update the isDirty flag and return its value
  this[isDirtyKey] = isDirty;
  return isDirty;
}