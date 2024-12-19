import { html, nothing } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export function youSure(options = {}) {
  const {
    message = 'Are you sure?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm = () => {},
    onCancel = () => {}
  } = options;

  if (!document.body.hasAttribute('listener-on-confirm-dialog')) {
    document.body.addEventListener('sl-after-hide', closeConfirmDialog);
    document.body.setAttribute('listener-on-confirm-dialog', true);
  }

  // Dialog element
  const dialog = document.createElement('sl-dialog');
  dialog.classList.add("confirm-dialog");
  dialog.label = message;
  dialog.style.setProperty('--body-spacing', '0em');

  // Dialog body content
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center;">
      <img src="/static/img/shibu-sure.jpeg" style="width: 100%" />
    </div>
  `;
  dialog.appendChild(content);

  // Dialog footer
  const footer = document.createElement('div');
  footer.slot = "footer";
  footer.style.display = 'flex';
  footer.style.gap = '1rem';
  footer.style.justifyContent = 'space-between';
  footer.innerHTML = `
    <sl-button class="cancel" variant="neutral" outline size="large" style="width:50%">${cancelText}</sl-button>
    <sl-button class="confirm" variant="warning" size="large" style="width:50%">${confirmText}</sl-button>
  `;
  dialog.appendChild(footer);

  // Button handling
  const confirmButton = dialog.querySelector('sl-button.confirm');
  const cancelButton = dialog.querySelector('sl-button.cancel');

  confirmButton.addEventListener('click', () => {
    onConfirm();
    dialog.hide();
  });

  cancelButton.addEventListener('click', () => {
    onCancel();
    dialog.hide();
  });

  document.body.append(dialog);
  dialog.show();
}

// Responsible for cleaning up the DOM after closing a confirm dialog
function closeConfirmDialog(e) {
  if (e.target.classList.contains('confirm-dialog')) {
    e.target.remove();
  }
}