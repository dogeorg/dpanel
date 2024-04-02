import { html, nothing } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import { stopPup, startPup } from '/api/action/action.js';
import { createAlert } from '/components/common/alert.js';

export function renderSummaryActions() {

  this.handleAction = handleAction

  return html`
    
    ${this.running ? html`
      </sl-tooltip>
        <sl-tooltip content="Stop">
        <sl-button ?disabled=${this.disabled} @click=${(e) => this.handleAction(e, 'stop')} variant="danger" outline size="medium">
          <sl-icon name="stop-fill" label="Stop"></sl-icon> Stop
        </sl-button>
      </sl-tooltip>
      ` : nothing
    }

    ${!this.running ? html`
      </sl-tooltip>
        <sl-tooltip content="Start">
        <sl-button ?disabled=${this.disabled} @click=${(e) => this.handleAction(e, 'start')} variant="success" outline size="medium">
          <sl-icon name="play-fill" label="Start"></sl-icon> Start
      </sl-button>
      ` : nothing
    }
  `
}

export async function handleAction (event, action) {  
  // Prevent event bubbling to parent
  // Because we don't want any parent handling this click and doing things
  event.stopPropagation();

  // Prevent issuing another request if already loading
  if (event.target.disabled) return;

  // Placeholder for err flag.
  let actionFailed;
  let button = event.currentTarget;

  // We know the target is a sl-button element (thx currentTarget)
  // Set its loading property to true to beging the button spinner
  button.loading = true;
  button.disabled = true;

  // Dispatch a 'busy-start' event
  this.dispatchEvent(new CustomEvent('busy-start', { bubbles: true, composed: true }));

  // Set this pupSnapshot as having focus
  this.focus = true;

  try {
    
    // Initiate a stopPup request over the network
    // and wait for it to complete
    action === 'start' 
      ? await startPup(this.pupId)
      : await stopPup(this.pupId)

  } catch (err) {

    // Not good. Alert the user.
    actionFailed = true;
    createAlert('danger', `
      Uh oh. Failed to ${action.toUpperCase()} pup`,
      'exclamation-diamond'
    );

  } finally {
    // The show must go on.
    // Stop loading, re-enable button
    button.loading = false;
    button.disabled = false;

    this.dispatchEvent(new CustomEvent('busy-stop', { bubbles: true, composed: true }));
    
    // If the action failed, do not adjust running state.
    if (actionFailed) {
      return;
    }

    // When successful, change running state.
    if (action === 'start') {
      this.running = true;
    }

    if (action === 'stop') {
      this.running = false;
    }

    // Remove focus from this snapshot, after a small delay
    setTimeout(() => {
      this.focus = false;
    }, 500);
  }
}
