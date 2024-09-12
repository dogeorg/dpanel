import { html, css, nothing } from "/vendor/@lit/all@3.1.2/lit-all.min.js";
import { doBootstrap } from "/api/bootstrap/bootstrap.js";

export function openConfig() {
  this.open_dialog = "configure";
  this.open_dialog_label = "Configure";
}

export function openDeps() {
  this.open_dialog = "deps";
  this.open_dialog_label = "Dependencies";
}

export async function handlePurgeFunction() {
  this.inflight_purge = true;
  const pupId = this.getPup().state.id
  this.requestUpdate();

  const callbacks = {
    onSuccess: async () => {
      await doBootstrap();
      this.inflight_purge = false;
      window.location.href = window.location.origin + "/pups";
    },
    onError: async () => {
      await doBootstrap();
      this.inflight_purge = false;
    },
    onTimeout: async () => {
      await doBootstrap();
      window.location.href = window.location.origin + "/pups";
      this.inflight_purge = false;
    }
  }
  await this.pkgController.requestPupAction(pupId, 'purge', callbacks);
}

export function renderActions(labels) {
  const pkg = this.getPup();
  const { installationId, statusId, statusLabel } = labels

  const hasButtons =
    ["needs_deps", "needs_config"].includes(statusId)
    || ["uninstalled"].includes(installationId)
    || pkg.state.manifest?.gui;

  const styles = css`
    .action-wrap {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 1em;

      &.margin {
        margin-top: 1.2em;
      }
    }

    .show-only-wide {
      display: none;
      @media (min-width: 800px) {
        display: inline-block;
      }
    }
  `

  return html`
    <div class="action-wrap ${hasButtons ? "margin" : ""}">

      ${statusId === 'needs_config' ? html`
        <sl-button variant="warning" size="large" @click=${this.openConfig}>
          <sl-icon slot="prefix" name="gear"></sl-icon>
          Configure
        </sl-button>
      ` : nothing }

      ${statusId === 'needs_deps' ? html`
        <sl-button variant="warning" size="large" name="deps" label="dependencies" @click=${this.openDeps}>
          View List
        </sl-button>
      ` : nothing }

      ${installationId === 'uninstalled' ? html`
        <sl-button variant="danger" outline size="large" @click=${this.handlePurgeFunction}>
          Cleanup storage
        </sl-button>
      ` : nothing }


      ${pkg.state.manifest?.gui ? html`
        <div style="display: flex; align-items: center;">
          ${statusId === 'needs_config' || statusId === 'needs_deps' ? html`
          <sl-divider class="show-only-wide" vertical style="height: 1.5em; margin-left: 0.1em;"></sl-divider>
          `: nothing}
          <sl-button size="large" variant="warning" href="${pkg.computed.guiURL}"} ?disabled="${installationId !== "ready" }">
            <sl-icon slot="prefix" name="stars"></sl-icon>
            Launch UI
          </sl-button>
        </div>
      ` : nothing }

    </div>
    <style>${styles}</style>
  `
};
