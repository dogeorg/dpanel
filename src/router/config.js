import { loadPup, asPage } from "./middleware.js"

export const routes = [
  {
    path: "/",
    component: "x-page-home",
    pageTitle: "Home",
    before: [asPage]
  },
  {
    path: "/stats",
    component: "stats-view",
    pageTitle: "Stats",
    before: [asPage]
  },
  {
    path: "/settings",
    component: "manage-view",
    pageTitle: "Settings",
    before: [asPage]
  },
  {
    path: "/pups",
    component: "x-page-pup-library",
    pageTitle: "Installed Pups",
    before: [asPage]
  },
  {
    path: "/pups/:pup",
    component: "x-page-pup-library-listing",
    dynamicTitle: true,
    pageAction: "back",
    before: [loadPup, asPage],
    animate: true,
  },
  {
    path: "/pups/:pup/logs",
    component: "x-log-viewer",
    pageTitle: "Logs",
    pageAction: "close",
    before: [loadPup, asPage],
    animate: true,
  },
  {
    path: "/explore",
    component: "x-page-pup-store",
    pageTitle: "Explore Pups",
    before: [asPage],
  },
  {
    path: "/explore/:pup",
    component: "x-page-pup-store-listing",
    dynamicTitle: true,
    pageAction: "back",
    before: [loadPup, asPage],
    animate: true,
  },
  {
    path: "/explore/:pup/ui",
    component: "x-page-pup-iframe",
    dynamicTitle: true,
    pageAction: "close",
    before: [loadPup, asPage],
    animate: true
  }
]