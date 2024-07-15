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
      <div id="GutterNav" class=${gutterNavClasses} ?open=${this.menuVisible}>
        <div class="gutter-body">
          <div id="logo" class="gutter-menu-item" @click=${() => window.location.reload(true)}>
            <img src="/static/img/dogebox-logo-small.png" />
          </div>
          <div id="menu" class="gutter-menu-item bg" @click=${this.handleMenuClick}>
            <sl-icon name="three-dots"></sl-icon>
          </div>
        </div>
        <div class="gutter-footer">
          <div id="profile" class="gutter-menu-item">
            <sl-icon name="person-circle"></sl-icon>
          </div>
          <div id="keys" class="gutter-menu-item">
            <sl-icon name="file-lock2-fill"></sl-icon>
          </div>
          <div id="connection" class="gutter-menu-item">
            <sl-icon name=${this.mainChannel.isConnected ? "hdd-network-fill" : "hdd-network"}></sl-icon>
          </div>
        </div>
      </div>

      <div id="Side" ?open=${this.menuVisible}>
        <div class=${sideNavClasses}>
          <div class"nav-body">
            <div class="menu-label">dpanel v0.0.2</div>
            <div class="menu-item ${CURPATH === "/" ? "active" : ""}">
              <sl-icon name="house-heart-fill"></sl-icon>
              <a href="/">Such Home</a>
            </div>

            <div class="menu-item-wrap ${CURPATH.startsWith("/pups/library") || CURPATH.startsWith("/pups/discover") ? "expand sub-active" : ""}">
              <div name="pups" @click=${this.handleExpandableMenuClick} class="menu-item">
                <sl-icon name="box-seam"></sl-icon>
                <a href="/library">Much Pups</a>
              </div>
              <div for="pups" class="sub-menu-list ${CURPATH.startsWith("/pups/library") || CURPATH.startsWith("/pups/discover") ? "" : "hidden"}">
                <div class="sub-menu-item ${CURPATH.startsWith("/pups/library") ? "active" : ""}">
                  <sl-icon name="collection"></sl-icon>
                  <a href="/pups/library">Installed</a>
                </div>
                <div class="sub-menu-item ${CURPATH.startsWith("/pups/discover") ? "active" : ""}">
                  <sl-icon name="search"></sl-icon>
                  <a href="/pups/discover">Discover</a>
                  </div>
              </div>
            </div>

            <div class="menu-item ${CURPATH.startsWith("/stats") ? "active" : ""}">
              <sl-icon name="heart-pulse-fill"></sl-icon>
              <a href="/stats">Very Stats</a>
            </div>

            <div class="menu-item ${CURPATH.startsWith("/config") ? "active" : ""}">
              <sl-icon name="sliders"></sl-icon>
              <a href="/config">So Config</a>
            </div>

            <section class="section-installed">
              <div class="menu-label">Pinned</div>
              <div class="menu-item ${CURPATH.startsWith("/pup/Map") ? "active" : ""}">
                <sl-icon name="map"></sl-icon>
                <a href="/pup/Map">Dogemap</a>
              </div>
              <div class="menu-item ${CURPATH.startsWith("/pup/Tipjar") ? "active" : ""}">
                <sl-icon name="database-gear"></sl-icon>
                <a href="/pup/Tipjar">Tipjar</a>
              </div>
              <div class="menu-item ${CURPATH.startsWith("/pup/Identity") ? "active" : ""}">
                <sl-icon name="person-circle"></sl-icon>
                <a href="/pup/Identity">Identity</a>
              </div>
            </section>
          </div>

          <div class="nav-footer">
            <sl-divider></sl-divider>
            <div class="nav-footer-content">
              <p>Propel the people's currency using your Dogebox.</p>
              <sl-button outline>Read Docs</sl-button>
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
