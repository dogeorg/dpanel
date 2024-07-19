import { html, classMap } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

export function renderNav(CURPATH) {
  const gutterNavClasses = classMap({
    pulse: this.systemPromptActive,
  });
  const sideNavClasses = classMap({
    inner: true,
    opaque: this.systemPromptActive,
  });
  return html`
    <nav id="Nav">
      <div id="Side" ?open=${this.menuVisible}>
        <div class=${sideNavClasses}>
          <div class"nav-body">

            <img class="logo" src="/static/img/dogebox-logo-small.png" />
            <h1 class="logotext">Dogebox</h1>

            <div @click=${this.handleNavClick} class="menu-item ${CURPATH === "/" ? "active" : ""}">
              <sl-icon name="house-heart-fill"></sl-icon>
              <a href="/">Home</a>
            </div>

            <div @click=${this.handleNavClick} name="pups" class="menu-item ${CURPATH.startsWith("/pups") ? "active" : ""}">
              <sl-icon name="box-seam"></sl-icon>
              <a href="/pups">Pups</a>
            </div>

            <div @click=${this.handleNavClick} name="discover" class="menu-item ${CURPATH.startsWith("/discover") ? "active" : ""}">
              <sl-icon name="search"></sl-icon>
              <a href="/discover">Discover</a>
            </div>

            <div @click=${this.handleNavClick} class="menu-item ${CURPATH.startsWith("/config") ? "active" : ""}">
              <sl-icon name="sliders"></sl-icon>
              <a href="/config">Settings</a>
            </div>

            <div @click=${this.handleNavClick} class="menu-item ${CURPATH.startsWith("/stats") ? "active" : ""}">
              <sl-icon name="heart-pulse-fill"></sl-icon>
              <a href="/stats">Monitor</a>
            </div>
          </div>

          <div class="nav-footer">
            <div class="connection online">
              <sl-icon name="cloud-check-fill"></sl-icon>
              Connected
            </div>
          </div>
        </div>
      </div>
    </nav>
  `;
}

export function handleExpandableMenuClick(e) {
  e.preventDefault();
  const sourceEl = e.currentTarget;
  const targetEl = this.shadowRoot.querySelector(
    `.sub-menu-list[for=${sourceEl.getAttribute("name")}]`,
  );
  sourceEl.parentNode.classList.toggle("expand");
  targetEl.classList.toggle("hidden");
}
