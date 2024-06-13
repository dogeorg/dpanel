import { LitElement, html, css } from "/vendor/@lit/all@3.1.2/lit-all.min.js";
import { promptStyles } from "../styles.js";

export class BaseTask extends LitElement {
  close() {
    this.dispatchEvent(
      new CustomEvent("task-close-request", {
        detail: {},
        bubbles: true,
        composed: true,
      }),
    );
  }
}
