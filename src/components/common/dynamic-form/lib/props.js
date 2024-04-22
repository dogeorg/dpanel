export function _initializeFormFieldProperties(newValue) {
  newValue.sections.forEach((section) => {
    // For each section, create a property to track modified field count
    this.constructor.createProperty(`_form_${section.name}_count`, { type: Number });
    this[`_form_${section.name}_count`] = 0;

    section.fields.forEach(field => {
      const propertyOptions = { type: String };

      // Create the standard property
      this.constructor.createProperty(field.name, propertyOptions);

      // Create the prefixed property (used for change tracking)
      const prefixedField = `__${field.name}`;
      this.constructor.createProperty(prefixedField, propertyOptions);

      // Create a property for dirty tracking
      const dirtyFlagFieldName = `__${field.name}_is_dirty`;
      this.constructor.createProperty(dirtyFlagFieldName, { type: Boolean });
    });
  });
}

export function _initializeValuesPreservingEdits(newValue) {
  let _newValue = {}
    // When dynamic-form is provided new values via an external actor
    // We should not immediately adopt them as the user may have edits.
    // Preserve edits.
    Object.keys(newValue).forEach(key => {
      if (this[this._dirtyFlagField(key)]) {
        // If the field is dirty, retain the current value
        _newValue[key] = this[key]
      } else {
        // If the field is not dirty, update it with the new value
        this[key] = newValue[key];
        this[`__${key}`] = newValue[key];
        _newValue[key] = newValue[key]
      }
    });

    this._values = _newValue;
}