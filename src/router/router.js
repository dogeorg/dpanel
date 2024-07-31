import { Router as VaadinRouter } from "/vendor/@vaadin/router@1.7.5/vaadin-router.min.js";
import {
  wrapActions as middleware,
  isAuthed,
  setTitle,
  setTravel,
  loadPup,
  performLogout,
  fade,
} from "./middleware.js";

let router;

class Router extends VaadinRouter {
  constructor(outlet, options) {
    super(outlet, options);
    this.outletWrapper = options.outletWrapper
  }

  getOutletWrapper() {
    return this.outletWrapper;
  }
}

export const getRouter = (targetElement, options) => {
  if (!router) {
    router = new Router(targetElement, options);

    // Configure routes
    router.setRoutes([
      // Auth
      { 
        path: "/login",
        action: middleware(),
        component: "login-view" 
      },
      {
        path: "/logout",
        action: middleware(performLogout)
      },

      // Main
      {
        path: "/",
        action: middleware(isAuthed, setTravel),
        children: [
          {
            path: "",
            component: "home-view", 
            pageTitle: "Home",
            action: setTitle,
          },
          {
            path: "/stats",
            component: "stats-view",
            pageTitle: "Monitor",
            action: setTitle,
          },
          {
            path: "/config",
            component: "manage-view",
            pageTitle: "Settings",
            action: setTitle,
          },
          {
            path: "/pups",
            action: middleware(loadPup),
            children: [
              {
                path: "/", // This will match "/pups/"
                component: "library-view",
                pageTitle: "Installed Pups",
                action: setTitle,
              },
              {
                path: "/:path", // Matches any subpath like "/pups/12345"
                component: "pup-page",
                dynamicTitle: true,
                action: fade,
              },
              {
                path: "/:path/logs", // Matches "/pups/12345/logs"
                component: "log-viewer",
                pageTitle: "Logs",
                pageAction: "close",
                action: fade,
              }
            ]
          },
          {
            path: "/discover",
            action: middleware(loadPup),
            children: [
              {
                path: "",
                component: "store-view",
                pageTitle: "Discover Pups",
                action: setTitle,
              },
              {
                path: "/:path",
                component: "pup-install-page",
                dynamicTitle: true,
                action: fade,
              }
            ]
          },
        ]
      },
    ]);
  }
  return { router, Router };
};
