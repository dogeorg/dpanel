
// import { html, fixture, expect, waitUntil } from "@open-wc/testing";
import { html, fixture, expect, waitUntil, elementUpdated, aTimeout } from "../../../../../dev/node_modules/@open-wc/testing";
import { sendKeys } from '../../../../../dev/node_modules/@web/test-runner-commands';
import { ONE_OF_EACH_FIELD_TYPE } from "./fixtures/one_of_each_field_type.js";

import "../dynamic-form.js";
import { customElementsReady } from '/utils/custom-elements-ready.js';

describe("DynamicForm", () => {

  it('given a single section, should render a single form', async () => {

    const fields = {
      sections: [
        { 
          name: 'section-foo', 
          fields: [
            { name: 'first', label: 'First', type: 'text' }
          ]
        }
      ]
    }
    
    // Initialise the component    
    const el = await fixture(html`
      <dynamic-form
        .fields=${fields}
      ></dynamic-form>
    `);

    // Wait until fields are initialized
    await waitUntil(() => el.fields, 'Fields did not become ready');

    // Target form
    const forms = el.shadowRoot.querySelectorAll('form')

    expect(forms).to.exist;
    expect(forms.length).to.equal(1);
    expect(forms[0].id).to.equal('section-foo');
  });

  it('given multiple sections, should render a multiple forms', async () => {

    const fields = {
      sections: [
        { 
          name: 'section-foo', 
          fields: [
            { name: 'first', label: 'First', type: 'text' }
          ]
        },
        { 
          name: 'section-bar', 
          fields: [
            { name: 'dob', label: 'Date of birth', type: 'date' }
          ]
        }
      ],

    }
    
    // Initialise the component    
    const el = await fixture(html`
      <dynamic-form
        .fields=${fields}
      ></dynamic-form>
    `);

    // Wait until fields are initialized
    await waitUntil(() => el.fields, 'Fields did not become ready');

    // Target form
    const forms = el.shadowRoot.querySelectorAll('form')

    expect(forms).to.exist;
    expect(forms.length).to.equal(2);
    expect(forms[0].id).to.equal('section-foo');
    expect(forms[1].id).to.equal('section-bar');
  });

  it('given a single field, should render field', async () => {

    const fields = {
      sections: [
        { 
          name: 'section-foo', 
          fields: [
            { name: 'first', label: 'First', type: 'text' }
          ]
        }
      ]
    }
    
    // Initialise the component    
    const el = await fixture(html`
      <dynamic-form
        .fields=${fields}
      ></dynamic-form>
    `);

    // Wait until fields are initialized
    await waitUntil(() => el.fields, 'Fields did not become ready');

    // Target form
    const form = el.shadowRoot.querySelector('form')
    const formControls = form.querySelectorAll('.form-control');
    const formInput = form.querySelector('sl-input');
    const formAttributeNames = formInput.getAttributeNames();

    // Should be 1 form-control element
    expect(formControls.length).to.equal(1);

    // Input should have the correct type, name and label.
    expect(formAttributeNames).to.deep.equal(['type', 'name', 'label'])
    expect(formInput.getAttribute('type')).to.equal('text');
    expect(formInput.getAttribute('name')).to.equal('first');
    expect(formInput.getAttribute('label')).to.equal('First');
  });

  it('given a multiple fields (1 of each type), should render all (14) fields with the correct input control', async () => {

    const fields = {
      sections: [
        { 
          name: 'section-foo', 
          fields: ONE_OF_EACH_FIELD_TYPE
        }
      ]
    }
    
    // Initialise the component    
    const el = await fixture(html`
      <dynamic-form
        .fields=${fields}
      ></dynamic-form>
    `);

    // Wait until fields are initialized
    await waitUntil(() => el.fields, 'Fields did not become ready');

    // Target form
    const form = el.shadowRoot.querySelector('form')
    const formControls = form.querySelectorAll('.form-control');

    // Should be 1 form-control element
    expect(formControls.length).to.equal(14);
    
    // Expect correct shoelace component usage
    const tags = [...formControls].map(c => c.children[0].tagName);
    expect(tags).to.deep.equal([
      'SL-INPUT', 'SL-INPUT', 'SL-INPUT', 'SL-INPUT', 'SL-INPUT',
      'SL-CHECKBOX', 'SL-SWITCH', 'SL-SELECT', 'SL-RADIO-GROUP', 'SL-RADIO-GROUP', 
      'SL-TEXTAREA', 'SL-COLOR-PICKER', 'SL-RANGE', 'SL-RATING']);

    // Expect correct type attribute set for the SL-INPUT (because it can be one of many)
    const textInputs = [...formControls]
      .filter(c => c.children[0].tagName === 'SL-INPUT')
      .map(c => c.children[0].getAttribute('type')
    )
    expect(textInputs).to.deep.equal(['text', 'email', 'password', 'date', 'number']);

    // Expect radios to reder correct sub type (sl-radio vs. sl-radio-button)
    const radioInputs = [...formControls]
      .filter(c => c.children[0].tagName === 'SL-RADIO-GROUP')
      .map(c => c.children[0].children[0].tagName
    )
    expect(radioInputs).to.deep.equal(['SL-RADIO', 'SL-RADIO-BUTTON']);
  });

  it.skip('enables form submit button on field modification', async () => {
    const fields = {
      sections: [
        { 
          name: 'section-foo', 
          fields: [
            { name: 'first', label: 'First', type: 'text' }
          ]
        }
      ]
    }

    const values = {
      'first': 'Joe'
    }
    
    // Initialise the component    
    const el = await fixture(html`
      <dynamic-form
        .fields=${fields}
        .values=${values}
      ></dynamic-form>
    `);

    // Wait until fields are initialized
    await waitUntil(() => el.values, 'Values did not become ready');

    // Target form
    const form = el.shadowRoot.querySelector('form')

    const submitButton = el.shadowRoot.querySelector('sl-button[type=submit]');
    const inputField = el.shadowRoot.querySelector('sl-input');

    expect(form).to.exist;
    expect(submitButton).to.exist;
    expect(submitButton.hasAttribute('disabled')).to.be.true;
    expect(inputField).to.exist;

    // Set focus on field, using dynamic-form custom focus() method
    el.focus('first');

    // With the sl-input now in focus, type "hello"
    // Todo.  Not working.
    await sendKeys({ type: 'hello' });

    await waitUntil(() => el._dirty, 'Form did not become modified');

    // // Assert that submit button is no longer disabled
    expect(submitButton.hasAttribute('disabled')).to.be.false;
  });
});
