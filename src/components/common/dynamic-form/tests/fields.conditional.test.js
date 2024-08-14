// Test helpers
import { html, fixture, expect, waitUntil, elementUpdated, aTimeout } from "../../../../../dev/node_modules/@open-wc/testing";
import { sendKeys } from '../../../../../dev/node_modules/@web/test-runner-commands';
import { repeatKeys } from '../../../../../dev/utils/keyboard.js';

// Fixtures
import { CONDITIONAL_FIELD } from "./fixtures/conditional_field.js";

// Component being tested.
import "../dynamic-form.js";

describe("DynamicForm", () => {

  it('when a conditional fields ruling is not met, it is not displayed', async () => {
    const fields = CONDITIONAL_FIELD;

    // Initialise the component
    const el = await fixture(html`
      <dynamic-form
        .fields=${fields}
      ></dynamic-form>
    `);

    // Wait until fields are initialized
    await waitUntil(() => el.values, 'Values did not become ready');

    // Target form
    const form = el.shadowRoot.querySelector('form')
    const formControls = form.querySelectorAll('.form-control');

    // Should be 2 form-control element
    expect(formControls.length).to.equal(2);

    // Expecting an inital two fields, an input and a select.
    const tags = [...formControls].map(c => c.children[0].tagName);
    expect(tags).to.deep.equal(['SL-INPUT', 'SL-SELECT']);
  });

  it.only('when a conditional fields ruling is already met, it is displayed', async () => {
    const fields = CONDITIONAL_FIELD;
    
    // The form reveals 2 more fields when network has a value of 'hidden'
    const values = {
      network: 'hidden'
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
    const formControls = form.querySelectorAll('.form-control');

    // Should be 4 form-control element
    expect(formControls.length).to.equal(4);

    // Expecting an inital four fields (because all conditions are met)
    const tags = [...formControls].map(c => c.children[0].tagName);
    expect(tags).to.deep.equal(['SL-INPUT', 'SL-SELECT', 'SL-INPUT', 'SL-INPUT']);
  });

  it('when a conditional fields ruling becomes met, it is displayed', async () => {
    const fields = CONDITIONAL_FIELD;

    // Initialise the component
    const el = await fixture(html`
      <dynamic-form
        .fields=${fields}
      ></dynamic-form>
    `);

    // Wait until fields are initialized
    await waitUntil(() => el.values, 'Values did not become ready');

    // Target form
    const form = el.shadowRoot.querySelector('form')
    const formControls = form.querySelectorAll('.form-control');

    // Should be 1 form-control element
    expect(formControls.length).to.equal(2);

    // Expecting an inital two fields, an input and a select.
    const tags = [...formControls].map(c => c.children[0].tagName);
    expect(tags).to.deep.equal(['SL-INPUT', 'SL-SELECT']);

    // Now meet the rule condition:
    // Set focus on field, using dynamic-form custom focus() method
    el.focus('network');

    // With the sl-input now in focus, select the second option of the dropdown
    await sendKeys({ press: 'ArrowDown' });
    await sendKeys({ press: 'ArrowDown' });
    await sendKeys({ press: 'Enter' });
    expect(el._network).to.equal('hidden')

    await elementUpdated(el);

    // Recount the number of fields.
    const formAgain = el.shadowRoot.querySelector('form')
    const formControlsAgain = formAgain.querySelectorAll('.form-control');
    expect(formControlsAgain.length).to.equal(4);

    // Now Expecting the initial two fields PLUS a revealed third and forth input field.
    const tagsAgain = [...formControlsAgain].map(c => c.children[0].tagName);
    expect(tagsAgain).to.deep.equal(['SL-INPUT', 'SL-SELECT', 'SL-INPUT', 'SL-INPUT']);
  });

});

