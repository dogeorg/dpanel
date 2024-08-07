import { html, css, nothing } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export function openConfig() {
  this.open_dialog = "configure";
  this.open_dialog_label = "Configure";
}

export function renderActions() {
  const pkg = this.context.store.pupContext;
  const styles = css`
    .action-wrap {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 1em;
    }

    .show-only-wide {
      display: none;
      @media (min-width: 800px) {
        display: inline-block;
      }
    }
  `
  const status = 'RUNNING' || pkg.state.status;

  return html`
    <div class="action-wrap">

      ${status === 'RUNNING' ? html`
        <sl-button variant="danger" size="large">
          <sl-icon slot="prefix" name="stop-fill"></sl-icon>
          Disable
        </sl-button>
        <sl-button variant="primary" size="large">
          <sl-icon slot="prefix" name="arrow-clockwise"></sl-icon>
          Restart
        </sl-button>
      ` : nothing }

      ${status === 'NEEDS_CONFIG' ? html`
        <sl-button variant="warning" size="large" @click=${this.openConfig}>
          <sl-icon slot="prefix" name="gear"></sl-icon>
          Configure
        </sl-button>
      ` : nothing }

      ${status === 'UNMET_DEP' ? html`
        <sl-button variant="warning" size="large">
          <sl-icon slot="prefix" name="stop-fill"></sl-icon>
          Configure
        </sl-button>
      ` : nothing }

      ${pkg.manifest.gui ? html`
        <div style="display: flex; align-items: center;">
          <sl-divider class="show-only-wide" vertical style="height: 1.5em; margin-left: 0.1em;"></sl-divider>
          <sl-button variant="primary" size="large" outline href="/explore/${pkg.manifest.id.toLowerCase()}/ui" ?disabled=${status === "NEEDS_CONFIG"}>
            <sl-icon slot="prefix" name="box-arrow-up-right"></sl-icon>
            Launch UI
          </sl-button>
        </div>
      ` : nothing }

    </div>
    <style>${styles}</style>
  `
};