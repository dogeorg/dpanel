import { Router } from '/vendor/@vaadin/router@1.7.5/vaadin-router.min.js';
import { wrapActions, loadPupContext, isAuthed, performLogout } from './middleware.js'

let router;

export const getRouter = (targetElement) => {
  if (!router) {
    router = new Router(targetElement);

    // Configure routes
    router.setRoutes([
      { path: '/logout', action: wrapActions(performLogout) },
      { path: '/login', action: wrapActions(), component: 'login-view' },
      { path: '/', action: wrapActions(isAuthed), component: 'home-view' },
      { path: '/pups', action: wrapActions(isAuthed), component: 'manage-view' },
      { path: '/stats', action: wrapActions(isAuthed), component: 'stats-view' },
      { path: '/config', action: wrapActions(isAuthed), component: 'config-view' },
      { path: '/config', action: wrapActions(isAuthed), component: 'config-view' },
      { path: '/form', action: wrapActions(isAuthed), component: 'form-view' },
      { path: '/manage', action: wrapActions(isAuthed), component: 'manage-view' },
      { path: '/pup/:path*', action: wrapActions(isAuthed, loadPupContext), component: 'iframe-view' },
    ]);
  }
  return router;
};
