import { Router as VaadinRouter } from "/vendor/@vaadin/router@1.7.5/vaadin-router.min.js";
import {
  wrapActions as middleware,
  isAuthed,
  setTravel,
  loadPup,
  performLogout,
  asPage
} from "./middleware.js";

let router;

class Router extends VaadinRouter {
  constructor(outlet, options) {
    super(outlet, options);
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
            action: middleware(asPage)
          },
          {
            path: "/stats",
            component: "stats-view",
            pageTitle: "Monitor",
            action: middleware(asPage)
          },
          {
            path: "/config",
            component: "manage-view",
            pageTitle: "Settings",
            action: middleware(asPage)
          },
          {
            path: "/pups",
            children: [
              {
                path: "/", // This will match "/pups/"
                component: "library-view",
                pageTitle: "Installed Pups",
                action: middleware(asPage)
              },
              {
                path: "/:pup", // Matches any subpath like "/pups/12345"
                component: "pup-page",
                dynamicTitle: true,
                action: middleware(loadPup, asPage),
                animate: false,
              },
              {
                path: "/:pup/logs", // Matches "/pups/12345/logs"
                component: "log-viewer",
                pageTitle: "Logs",
                pageAction: "close",
                action: middleware(loadPup, asPage),
                animate: false,
              }
            ]
          },
          {
            path: "/explore",
            children: [
              {
                path: "",
                component: "store-view",
                pageTitle: "Explore",
                action: middleware(loadPup, asPage),
              },
              {
                path: "/:pup",
                component: "pup-install-page",
                dynamicTitle: true,
                action: middleware(loadPup, asPage),
                animate: false,
              },
              {
                path: "/:pup/ui", // Matches "/pups/12345/ui"
                component: "iframe-view",
                pageTitle: "Explore > Dogecoin",
                pageAction: "close",
                action: middleware(loadPup, asPage),
                animate: false,
              }
            ]
          },
        ]
      },
    ]);
  }
  return { router, Router };
};
