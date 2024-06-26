export function _initializeFormFieldProperties(newValue) {
  newValue.sections.forEach((section) => {
    // For each section, create a property to track modified field count
    this.constructor.createProperty(`_form_${section.name}_count`, { type: Number });
    this[`_form_${section.name}_count`] = 0;

    section.fields.forEach(field => {

      const { currentKey, originalKey, isDirtyKey, repeatKey } = this.propKeys(field.name);

      // Create the standard property
      this.constructor.createProperty(currentKey, { type: String });

      // Create the prefixed property (used for change tracking)
      this.constructor.createProperty(originalKey, { type: String });

      // Create a property for dirty tracking
      this.constructor.createProperty(isDirtyKey, { type: Boolean });

      if (field.type === 'password' && field.requireConfirmation) {
        this.constructor.createProperty(repeatKey, { type: String });
      }
    });
  });
}

export function _initializeValuesPreservingEdits(newValue) {
  let _newValue = {}
  // When dynamic-form is provided new values via an external actor
  // We should not immediately adopt them as the user may have edits.
  // Preserve edits.
  Object.keys(newValue).forEach(key => {

    const { currentKey, originalKey, isDirtyKey } = this.propKeys(key);

    if (this[isDirtyKey]) {
      // If the field is dirty, retain the current value
      _newValue[key] = this[currentKey]
    } else {
      // If the field is not dirty, update it with the new value
      this[currentKey] = newValue[key];
      this[originalKey] = newValue[key];
      _newValue[key] = newValue[key]
    }
  });

  this._values = _newValue;
}

export function propKeys(fieldName) {
  return {
    currentKey: `_${fieldName.toLowerCase()}`,
    originalKey: `__${fieldName.toLowerCase()}`,
    isDirtyKey: `__${fieldName.toLowerCase()}_is_dirty`,
    repeatKey: `_${fieldName.toLowerCase()}_repeat`
  }
}