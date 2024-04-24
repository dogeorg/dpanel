import { getFormControls } from '/vendor/@shoelace/cdn@2.14.0/utilities/form.js';

export async function _handleSubmit(event) {
  event.preventDefault();

  // Test if form is valid.
  const formControls = getFormControls(event.currentTarget)
  const isValid = [...formControls].every(control => control.checkValidity());

  if (!isValid) {
    console.log('FORM AHS VALIASDSD ISSUESSUS!');
    return;
  }
  
  // Set submitting state
  this._loading = true;

  const modifiedFieldNodes = this.shadowRoot.querySelectorAll(`#${event.target.id} [data-dirty-field]`)

  // Collect data
  let formData = {};
  Array
    .from(modifiedFieldNodes)
    .map(node => node.name)
    .forEach((fieldName) => {
      const { currentKey } = this.propKeys(fieldName);
      formData[fieldName] = this[currentKey]
    });

  // Attempt save.
  await this.onSubmit(formData).catch((err) => {
    // ## ON ERROR
    console.warn('Form submission failed:', err);
    this._loading = false;
    return;
  })

  // // ## ON SUCCESS
  console.log('Done submitting');

  // Sync the prefixed properties
  Object.keys(formData).forEach((fieldName) => {
    const { currentKey, originalKey } = this.propKeys(fieldName);
    this[originalKey] = this[currentKey];
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