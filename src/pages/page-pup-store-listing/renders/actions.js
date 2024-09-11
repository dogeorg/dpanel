import { html, css, nothing } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export function openConfig() {
  this.open_dialog = "configure";
  this.open_dialog_label = "Configure";
}

export function renderActions() {
  // const pupDefinitionContext = this.context.store?.pupDefinitionContext

  // const def = this.pkgController.getPupDefinition(pupDefinitionContext.source.id, pupDefinitionContext.id);
  // const pkg = this.pkgController.getPup(def.installedId)

  // const installationId = pkg?.computed?.installationId;
  // const installationLabel = pkg?.computed?.installationLabel;
  // const statusId = pkg?.computed?.statusId;
  // const statusLabel = pkg?.computed?.statusLabel;

  const pupContext = this.context.store?.pupContext;
  const pkg = this.getPup();

  const installationId = pkg.computed.installationId;
  const installationLabel = pkg.computed.installationLabel;

  const isInstalled = pkg.computed.isInstalled;
  const isLoadingStatus = ["installing"].includes(installationId);

  const styles = css`
    .action-wrap {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 1em;
      margin-top: 1.2em;

      sl-button {
        min-width: 180px;
      }
    }
  `;

  return html`
    <div class="action-wrap">
      ${!isInstalled && installationId !== "installing"
        ? html`
            <sl-button
              variant="warning"
              size="large"
              @click=${this.handleInstall}
              ?disabled=${this.inflight}
              ?loading=${this.inflight}
            >
              Such Install
            </sl-button>
          `
        : nothing}
      ${isInstalled && installationId === "installing"
        ? html`
            <sl-button variant="warning" size="large" disabled>
              Installing
              <sl-spinner
                slot="suffix"
                style="--indicator-color:#222"
              ></sl-spinner>
            </sl-button>
          `
        : nothing}
      ${isInstalled && installationId !== "installing"
        ? html`
            <sl-button
              variant="primary"
              size="large"
              href="${pkg.computed.libraryURL}"
            >
              Manage
            </sl-button>
          `
        : nothing}
    </div>
    <style>
      ${styles}
    </style>
  `;
}

export async function handleInstall() {
  const pupContext = this.context.store.pupContext;
  const pkg = this.getPup();
  this.inflight = true;
  const callbacks = {
    onSuccess: () => {
      this.inflight = false;
    },
    onError: () => {
      console.log("Txn reported an error");
      this.inflight = false;
    },
    onTimeout: () => {
      console.log("Slow txn, no repsonse within ~30 seconds (install)");
      this.inflight = false;
    },
  };

  const body = {
    sourceId: pkg.def.source.id,
    pupName: pkg.def.versions[pkg.def.latestVersion].meta.name,
    pupVersion: pkg.def.latestVersion,
  };

  console.log("issuing install request: ", { ...body });
  await this.pkgController.requestPupAction("--", "install", callbacks, body);
}
