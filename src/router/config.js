import { loadPup, asPage } from "./middleware.js"

export const routes = [
  {
    path: "/",
    component: "home-view",
    pageTitle: "Home",
    before: [asPage]
  },
  {
    path: "/stats/",
    component: "stats-view",
    pageTitle: "Stats",
    before: [asPage]
  },
  {
    path: "/config",
    component: "manage-view",
    pageTitle: "Settings",
    before: [asPage]
  },
  {
    path: "/pups",
    component: "library-view",
    pageTitle: "Installed Pups",
    before: [asPage]
  },
  {
    path: "/pups/:pup",
    component: "pup-page",
    dynamicTitle: true,
    pageAction: "back",
    before: [loadPup, asPage],
    animate: true,
  },
  {
    path: "/pups/:pup/logs",
    component: "log-viewer",
    pageTitle: "Logs",
    pageAction: "close",
    before: [loadPup, asPage],
    animate: true,
  },
  {
    path: "/explore",
    component: "store-view",
    pageTitle: "Explore Pups",
    before: [asPage],
  },
  {
    path: "/explore/:pup", // Matches any subpath like "/pups/12345"
    component: "pup-install-page",
    dynamicTitle: true,
    pageAction: "back",
    before: [loadPup, asPage],
    animate: true,
  },
]