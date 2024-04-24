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

  console.log('EVENT TARGET THING', event.target.id);
  const formId = event.target.id

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

  let err = false;

  // Attempt submit.
  const requestSubmitSuccess = await this.onSubmit(
    formData, {
      onSuccess: () => this.commit(formId),
      onError: this._handleError
    }
  ).catch((err) => {
    // ## ON ERROR
    console.warn('Error occurred within provided onSubmit fn', err);
    this._loading = false;
  })

  if (!requestSubmitSuccess) {
    // Error submitting change request.
    // Not continuining.
    console.warn('Error submitting changes, changes not saved.', { requestSubmitSuccess });
    this._loading = false;
    return;
  }

  console.log('Done submitting');

}

export async function commit(formId) {
  // In this scenario, the form submitted successfully and the txn resolved successfully.
  // We should not mark the form as clean.

  console.log('COMMIT CALLED!', { formId });

  const modifiedFieldNodes = this.shadowRoot.querySelectorAll(`#${formId} [data-dirty-field]`)

  let formData = {};
  Array
    .from(modifiedFieldNodes)
    .map(node => node.name)
    .forEach((fieldName) => {
      const { currentKey } = this.propKeys(fieldName);
      formData[fieldName] = this[currentKey]
    });

  // Sync the prefixed properties
  Object.keys(formData).forEach((fieldName) => {
    const { currentKey, originalKey } = this.propKeys(fieldName);
    this[originalKey] = this[currentKey];
  });

  // Reset
  this._loading = false;
  this._checkForChanges();

  // Dispatch a form success event.
  this.dispatchEvent(new CustomEvent('form-submit-success', {
    detail: {},
    composed: true,
    bubbles: true
  }));
}

export async function _handleError(payload) {
  // In this scenario, the form submitted successfully but the txn resolved with an error.
  // We should not mark the form as clean.
  this._loading = false;

  if (this.onError && typeof this.onError === 'function') {
    try {
      this.onError(payload)
    } catch(err) {
      console.warn('onError function provided to dynamic-form threw an error', err)
    }
  }
}