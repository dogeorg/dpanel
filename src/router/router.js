import { Router } from '/vendor/@vaadin/router@1.7.5/vaadin-router.min.js';
import { wrapActions, loadPupContext, loadPupManagementContext, isAuthed, performLogout } from './middleware.js'

let router;

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
      { path: '/pup/:path*', action: wrapActions(isAuthed, loadPupContext), component: 'iframe-view', dynamicTitle: true },

      // Pup Listings
      { path: '/pups/library', action: wrapActions(isAuthed), component: 'library-view', pageTitle: "Installed Pups" },
      { path: '/pups/discover', action: wrapActions(isAuthed), component: 'store-view', pageTitle: "Discover Pups" },

      // Pup Management
      { path: '/pups/:path*', action: wrapActions(isAuthed, loadPupManagementContext), component: 'pup-view', dynamicTitle: true  },

      // Settings
      { path: '/config', action: wrapActions(isAuthed), component: 'manage-view', pageTitle: "Settings" },

      // Charts
      { path: '/stats', action: wrapActions(isAuthed), component: 'stats-view', pageTitle: "Monitor" },
    ]);
  }
  return { router, Router };
};
