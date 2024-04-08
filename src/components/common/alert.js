export function createAlert(variant, message, icon = 'info-circle', duration = 3000) {
  const alert = document.createElement('sl-alert');
  alert.variant = variant;
  alert.closable = true;
  alert.duration = duration;
  alert.innerHTML = `
    <sl-icon name="${icon}" slot="icon"></sl-icon>
    ${escapeHtml(message)}
  `;
  document.body.append(alert);
  alert.toast();
}

// Utility function to escape HTML
function escapeHtml(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}