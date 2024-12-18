import { css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

export const styles = css`
  :host {
  --hyper-green: #07ffae;

  display: block;
  width: 100%;
  height: 100%;
  background: #131313;
  z-index: 999;
}

.inner {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  box-sizing: border-box;
  align-items: center;
  padding: .5rem 1rem;
  color: #777;
  width: 100%;
  height: 100%;
}

:host([active]) .inner {
  color: var(--hyper-green);
}

.inner:hover {
  color: var(--hyper-green);
  cursor: pointer;
}

.inner:hover .text {
  text-decoration: underline;
}

.text {
  font-family: 'Comic Neue';
  font-weight: bold;
  font-size: 1rem;
  padding-left: .5rem;
}

.loader-bar {
  --hyper-green: #07ffae;
  --height: 4px;
  --indicator-color: var(--hyper-green);
}

.loader-bar::part(base) {
  border-radius: 0px;
}

.celebrate {
  opacity: 0;
  visibility: hidden;
  color: var(--hyper-green);
}

.celebrate.flash {
  animation: flash-fade 1s ease-out forwards;
}

@keyframes flash-fade {
  0% {
    opacity: 0;
    visibility: visible;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    visibility: hidden;
  }
}
`