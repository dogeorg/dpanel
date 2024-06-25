import { css } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

const pink = css`
  sl-button.pink[variant="text"]::part(label) {
    color: var(--sl-color-pink-600);
    cursor: pointer;
  }
  sl-button.pink:not([variant="text"])::part(base) {
    background-color: var(--sl-color-pink-600);
    border-color: var(--sl-color-pink-600);
  }
  sl-button.pink:is(:not([disabled], [loading], [variant="text"]))::part(base):hover {
    background-color: var(--sl-color-pink-500);
    border-color: var(--sl-color-pink-500);
  }
  sl-button.pink:is(:not([disabled], [loading], [variant="text"]))::part(base):active {
    background-color: var(--sl-color-pink-400);
    border-color: var(--sl-color-pink-400);
  }
`

const yellow = css`
  sl-button.yellow[variant="text"]::part(label) {
    color: var(--sl-color-amber-600);
  }
  sl-button.yellow:not([variant="text"])::part(base) {
    background-color: var(--sl-color-amber-600);
    border-color: var(--sl-color-amber-600);
  }
  sl-button.yellow:is(:not([disabled], [loading], [variant="text"]))::part(base):hover {
    background-color: var(--sl-color-amber-500);
    border-color: var(--sl-color-amber-500);
  }
  sl-button.yellow:is(:not([disabled], [loading], [variant="text"]))::part(base):active {
    background-color: var(--sl-color-amber-400);
    border-color: var(--sl-color-amber-400);
  }
`

export const themes = [
  pink, yellow
]