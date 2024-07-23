import { LitElement, html, css } from "/vendor/@lit/all@3.1.2/lit-all.min.js";
import "/components/common/action-row/action-row.js";

class HealthCheck extends LitElement {
  static get properties() {
    return {
      status: { type: String },
      check: { type: Object },
    };
  }

  constructor() {
    super();
    this.check = {};
    this.status = "loading";
  }

  determine(status) {
    let prefix = "";
    let variant = "";

    switch (status) {
      case "success":
        return {
          prefix: "check2",
          variant: "success",
        };
        break;
      case "error":
        return {
          prefix: "x-lg",
          variant: "danger",
        };
        break;
      case "warning":
        return {
          prefix: "exclamation-triangle",
          variant: "warning",
        };
        break;
      case "loading":
        return {
          prefix: "arrow",
          variant: "primary",
        };
        break;
      default: {
        return {
          prefix: "question-circle",
          variant: "",
        };
      }
    }
  }

  render() {
    const check = this.check;

    return html`
      <action-row
        name="${check.name}"
        label="${check.label}"
        prefix=${this.determine(this.status).prefix}
        variant=${this.determine(this.status).variant}
        ?loading=${this.status === "loading"}
      >
        ${check.description}
      </action-row>
    `;
  }
}

customElements.define("health-check", HealthCheck);
