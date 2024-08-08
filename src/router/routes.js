export const routes = [
  {
    path: "/",
    component: "home-view",
  },
  {
    path: "/stats",
    component: "stats-view",
  },
  {
    path: "/config",
    component: "manage-view",
  },
  {
    path: "/pups",
    component: "library-view",
  },
  {
    path: "/pups/:pup", // Matches any subpath like "/pups/12345"
    component: "pup-page",
  },
  {
    path: "/pups/:pup/logs", // Matches "/pups/12345/logs"
    component: "log-viewer",
  }
]