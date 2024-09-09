import { isAuthed, loadPup, loadPupDefinition, asPage, performLogout } from "./middleware.js"

export const routes = [
  {
    path: "/",
    component: "x-page-home",
    pageTitle: "Home",
    before: [isAuthed, asPage]
  },
  {
    path: "/logout",
    before: [performLogout]
  },
  {
    path: "/login",
    component: "x-action-login",
  },
  {
    path: "/stats",
    component: "x-page-stats",
    pageTitle: "Stats",
    before: [isAuthed, asPage]
  },
  {
    path: "/settings",
    component: "x-page-settings",
    pageTitle: "Settings",
    before: [isAuthed, asPage]
  },
  {
    path: "/pups",
    component: "x-page-pup-library",
    pageTitle: "Installed Pups",
    before: [isAuthed, asPage]
  },
  {
    path: "/pups/:pup/:name",
    component: "x-page-pup-library-listing",
    dynamicTitle: true,
    pageAction: "back",
    before: [isAuthed, asPage],
    after: [loadPup],
    animate: true,
  },
  {
    path: "/pups/:s/:name/logs",
    component: "x-page-pup-logs",
    pageTitle: "Logs",
    pageAction: "close",
    before: [isAuthed, asPage],
    after: [loadPup],
    animate: true,
  },
  {
    path: "/explore",
    component: "x-page-pup-store",
    pageTitle: "Explore Pups",
    before: [isAuthed, asPage],
  },
  {
    path: "/explore/:source/:name",
    component: "x-page-pup-store-listing",
    dynamicTitle: true,
    pageAction: "back",
    before: [isAuthed, asPage],
    after: [loadPupDefinition],
    animate: true,
  },
  {
    path: "/explore/:pup/:name/ui",
    component: "x-page-pup-iframe",
    dynamicTitle: true,
    pageAction: "close",
    before: [isAuthed, asPage],
    animate: true
  }
]