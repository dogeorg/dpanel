import { Router } from '/vendor/@vaadin/router@1.7.5/vaadin-router.min.js';
import { wrapActions, loadPupContext, isAuthed, performLogout } from './middleware.js'

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

      // Pups
      { path: '/pup/:path*', action: wrapActions(isAuthed, loadPupContext), component: 'iframe-view' },
      { path: '/pups/library', action: wrapActions(isAuthed), component: 'library-view' },
      { path: '/pups/discover', action: wrapActions(isAuthed), component: 'store-view' },

      // Settings
      { path: '/config', action: wrapActions(isAuthed), component: 'manage-view' },

      // Charts
      { path: '/stats', action: wrapActions(isAuthed), component: 'stats-view' },
    ]);
  }
  return { router, Router };
};
