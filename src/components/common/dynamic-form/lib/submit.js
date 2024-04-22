export async function _handleSubmit(event) {
  event.preventDefault();
  
  // Set submitting state
  this._loading = true;

  const modifiedFieldNodes = this.shadowRoot.querySelectorAll(`#${event.target.id} [data-dirty-field]`)

  // Collect data
  let formData = {};
  Array
    .from(modifiedFieldNodes)
    .map(node => node.name)
    .forEach(fieldName => formData[fieldName] = this[fieldName]);

  // // Attempt save.
  await this.onSubmit(formData).catch((err) => {
    // ## ON ERROR
    console.warn('Form submission failed:', err);
    this._loading = false;
    return;
  })

  // // ## ON SUCCESS
  console.log('Done submitting');

  // Sync the prefixed properties
  Object.keys(formData).forEach(field => {
    this[`__${field}`] = this[field];
  });

  // Reset
  this._loading = false;
  this._checkForChanges();

  this.dispatchEvent(new CustomEvent('form-submit-success', {
    detail: {},
    composed: true,
    bubbles: true
  }));
}