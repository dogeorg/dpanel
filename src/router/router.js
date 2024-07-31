import { Router as VaadinRouter } from "/vendor/@vaadin/router@1.7.5/vaadin-router.min.js";
import {
  wrapActions,
  loadPupContext,
  loadPupManagementContext,
  isAuthed,
  performLogout,
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
      { path: "/logout", action: wrapActions(performLogout) },
      { path: "/login", action: wrapActions(), component: "login-view" },

      // Home
      { path: "/", 
        action: wrapActions(isAuthed), 
        component: "home-view", 
        pageTitle: "Home"
      },

      // Pup Iframe
      {
        path: "/pup/:path*",
        action: wrapActions(isAuthed, loadPupContext),
        component: "iframe-view",
        dynamicTitle: true,
      },

      // Pup Listings
      {
        path: "/pups",
        action: wrapActions(isAuthed),
        component: "library-view",
        pageTitle: "Installed Pups",
      },
      {
        path: "/discover",
        action: wrapActions(isAuthed),
        component: "store-view",
        pageTitle: "Discover Pups",
      },
      // Pup Listing
      {
        path: "/discover/:path*",
        action: wrapActions(isAuthed, loadPupManagementContext),
        component: "pup-install-page",
        dynamicTitle: true,
      },
      // Pup Management :: Logs
      {
        path: "/pups/:path*/logs",
        action: wrapActions(isAuthed, loadPupManagementContext),
        component: "log-viewer",
        pageTitle: "Logs",
        pageAction: "close",
      },
      // Pup Management
      {
        path: "/pups/:path*",
        action: wrapActions(isAuthed, loadPupManagementContext),
        component: "pup-page",
        dynamicTitle: true,
      },

      // Settings
      {
        path: "/config",
        action: wrapActions(isAuthed),
        component: "manage-view",
        pageTitle: "Settings",
      },

      // Charts
      {
        path: "/stats",
        action: wrapActions(isAuthed),
        component: "stats-view",
        pageTitle: "Monitor",
      },
    ]);
  }
  return { router, Router };
};
