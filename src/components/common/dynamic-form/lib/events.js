export function _dispatchEvent(name, detail) {
  this.dispatchEvent(new CustomEvent(
  `form-${name}`, {
    detail,
    composed: true,
    bubbles: true,
  }));
}
