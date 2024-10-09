import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import "/components/views/x-install-log-viewer.js";

export function renderInstallationLogs({ pupId, installationId }) {
  return html`
    <x-install-log-viewer></x-install-log-viewer>
  `
}; 
