import { html, choose, unsafeHTML } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export function renderPopoverPage(open_page) {
  return html`
    <div>
      ${choose(open_page, [
        ['logs', () => html`<log-viewer ?autostart=${true}></log-viewer>`],
      ],
      () => html`<span>View not provided</span>`)}
    </div>
  `
}