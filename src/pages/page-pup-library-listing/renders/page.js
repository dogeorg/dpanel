import { html, choose, unsafeHTML } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export function renderPopoverPage(open_page) {
  const pupContext = this.context.store?.pupContext
  const pkg = this.pkgController.getPup(pupContext.id);
  return html`
    ${choose(open_page, [
      ['logs', () => html`<log-viewer ?autostart=${true} pupId="${pkg.manifest.id}"></log-viewer>`],
    ],
    () => html`<span>View not provided</span>`)}
  `
}