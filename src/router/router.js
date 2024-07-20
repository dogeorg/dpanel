import { Router as VaadinRouter } from '/vendor/@vaadin/router@1.7.5/vaadin-router.min.js';
import { wrapActions, loadPupContext, loadPupManagementContext, isAuthed, performLogout } from './middleware.js'

let router;

class Router extends VaadinRouter {
  constructor(outlet, options) {
    super(outlet, options);
    this.previousPathname = null;  // Initialize previous pathname storage
  }

  setPreviousPathname() {
    // Capture the previous pathname before the router updates the location
    this.previousPathname = this.location ? this.location.pathname : null;
  }

  getPreviousPathname() {
    return this.previousPathname;
  }
}

export const getRouter = (targetElement) => {
  if (!router) {
    router = new Router(targetElement);

    // Configure routes
    router.setRoutes([
      // Auth
      { path: '/logout', action: wrapActions(performLogout) },
      { path: '/login', action: wrapActions(), component: 'login-view' },
      
      // Home
      { path: '/', action: wrapActions(isAuthed), component: 'home-view' },

      // Pup Iframe
      { path: '/kennel/:path*', action: wrapActions(isAuthed, loadPupContext), component: 'iframe-view', dynamicTitle: true },

      // Pup Listings
      { path: '/pups', action: wrapActions(isAuthed), component: 'library-view', pageTitle: "Installed Pups" },
      { path: '/discover', action: wrapActions(isAuthed), component: 'store-view', pageTitle: "Discover Pups" },

      // Pup Management
      { path: '/pups/:path/logs', action: wrapActions(isAuthed), pageTitle: "Logs", pageAction: "close" },
      { path: '/pups/:path/actions', action: wrapActions(isAuthed), pageTitle: "Actions", pageAction: "close" },
      { path: '/pups/:path*', action: wrapActions(isAuthed, loadPupManagementContext), component: 'pup-management-view', dynamicTitle: true  },

      // Settings
      { path: '/config', action: wrapActions(isAuthed), component: 'manage-view', pageTitle: "Settings" },

      // Charts
      { path: '/stats', action: wrapActions(isAuthed), component: 'stats-view', pageTitle: "Monitor" },
    ]);
  }
  return { router, Router };
};
