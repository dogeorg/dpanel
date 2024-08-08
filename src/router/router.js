export class Router {
  constructor(outlet, options = {}) {
    this.routes = [];
    this.outlet = outlet;
    this.transitionDuration = options.transitionDuration || 3000;

    this.setupLinkInterceptor();

    window.onpopstate = function (event) {
      this.navigate(window.location.pathname);
    };

    window.onload = () => {
      this.navigate(window.location.pathname);
    };
  }

  setRoutes(routes) {
    routes.forEach((route) => {
      this.addRoute(route.path, route.component, {
        before: route.before,
        middleware: route.middleware,
        after: route.after,
      });
    });
  }

  addRoute(path, component, { before, middleware, after } = {}) {
    const componentClass = customElements.get(component);
    if (!componentClass) {
      console.error(`Component ${component} not found.`);
      return;
    }
    const routePattern = path.replace(/:[^\s/]+/g, "([^/]+)");
    const regex = new RegExp(`^${routePattern}$`);
    this.routes.push({
      path,
      regex,
      component: componentClass,
      before,
      middleware,
      after,
    });
  }

  navigate(path) {
    const route = this.routes.find((route) => route.regex.test(path));
    if (!route) {
      console.error(`No route found for path: ${path}`);
      return;
    }

    const paramsMatch = route.regex.exec(path);
    const params = this.extractParams(route.path, paramsMatch);
    const context = { params };

    const processRoute = async () => {
      if (route.before)
        await Promise.all(route.before.map((func) => func(context)));

      if (route.middleware) {
        const continueNavigation = await route.middleware(context);
        if (!continueNavigation) {
          console.log("Middleware blocked navigation.");
          return;
        }
      }

      const componentInstance = new route.component();
      this.performTransition(componentInstance);

      if (route.after)
        await Promise.all(route.after.map((func) => func(context)));
    };

    processRoute().catch(console.error);
  }

  setupLinkInterceptor() {
    document.addEventListener("click", (event) => {
      const path = event.composedPath();
      const target = path[0];
      const anchor = target.closest("a");
      if (anchor && anchor.href) {
        event.preventDefault();
        const href = anchor.getAttribute("href");
        history.pushState({}, "", href);
        this.navigate(href);
      }
    });
  }

  extractParams(routePath, paramsMatch) {
    const paramNames = routePath.match(/:([^/]+)/g) || [];
    const params = {};
    paramNames.forEach((name, index) => {
      params[name.substring(1)] = paramsMatch[index + 1];
    });
    return params;
  }

  performTransition(newComponent) {
    const currentComponent = this.outlet.firstChild;
    this.outlet.appendChild(newComponent);

    if (currentComponent) {
      setTimeout(() => {
        this.outlet.removeChild(currentComponent);
      }, this.transitionDuration);
    }
  }
}
