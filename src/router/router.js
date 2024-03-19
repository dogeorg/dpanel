import { Router } from '/vendor/@vaadin/router@1.7.5/vaadin-router.min.js';

let router;

export const getRouter = (targetElement) => {
  if (!router) {
    router = new Router(targetElement);

    // Configure routes
    router.setRoutes([
      // ...your route definitions
    ]);
  }
  return router;
};
