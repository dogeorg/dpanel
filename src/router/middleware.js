// import { getManifest } from "/api/manifest/index.js";
import { store } from "/state/store.js";
import { pkgController } from "/controllers/package/index.js";
import { getBootstrap } from "/api/bootstrap/bootstrap.js";
import { getRouter } from "/router/router.js";

export const wrapActions =
  (...actions) =>
  async (context, commands) => {
    // Execute each action in sequence
    for (const action of actions) {
      const result = await action(context, commands);
      // If an action returns a command (like redirect), return it immediately
      if (result) {
        return result;
      }
    }
    // After all actions have completed, call setMenu
    setTitle(context, commands);
    return setMenu(context, commands);
  };

// Example middleware
export function logPathMiddleware(context, commands) {
  console.log("Navigating to path:", context.pathname);
  return undefined; // Proceed with the navigation
}

// When navigating to /pup/*, fetch the app context and set on state.
export async function loadPupContext(context, commands) {
  try {
    const pupId = context.pathname.replace("/pup/", "");

    // ensure bootstrap (temporary)
    const res = await getBootstrap();
    pkgController.setData(res);

    const pup = pkgController.getPup(pupId);
    const manifest = pup?.manifest;

    if (!manifest) {
      throw new Error("manifest empty");
    }

    if (!manifest.gui) {
      throw new Error("pup is gui-less");
    }

    store.updateState({ pupContext: { manifest } });
    return undefined;
  } catch (error) {
    console.error("Error fetching manifest:", error);
  }

  return commands.redirect('/error?type="pup-loading-error');
}

export async function loadPupManagementContext(context, commands) {
  try {
    const pupId = context.params.path[0];

    // ensure bootstrap (temporary)
    const res = await getBootstrap();
    pkgController.setData(res);

    const pup = pkgController.getPup(pupId);
    const { manifest, state } = pup;

    if (!manifest) {
      throw new Error("manifest empty");
    }

    store.updateState({
      pupContext: { manifest, state },
      appContext: {
        pageTitle: context.params.path[1] || manifest.package,
        pageAction: context.params.path[1] ? "close" : "back",
      }
    });

    return undefined;
  } catch (error) {
    console.error("Error fetching manifest:", error);
  }

  return commands.redirect('/error?type="pup-mgr-loading-error');
}

function setMenu(context, commands) {
  const r = getRouter().router;

  r.setPreviousPathname();

  store.updateState({
    appContext: {
      pathname: context.pathname,
      path: context.params.path,
      previousPathname: r.getPreviousPathname(),
      upwardPathname: removeLastPathSegment(context.pathname),
      menuVisible: false
    },
  });

  return undefined;
}

function setTitle(context, commands) {
  if (context?.route?.pageTitle || !context?.route?.dynamicTitle) {
    store.updateState({
      appContext: {
        pageTitle: context?.route?.pageTitle || "",
        pageAction: context?.route?.pageAction || ""
      },
    });
  }
  return undefined;
}

export function setOverflow(context, commands) {
  document.body.style.overflow = context.params.path[1] ? 'hidden' : 'auto';
  return undefined
}

export function isAuthed(context, commands) {
  if (store.networkContext.token) {
    return undefined;
  } else {
    return commands.redirect("/login");
  }
}

export function performLogout(context, commands) {
  store.updateState({ networkContext: { token: false } });
  return commands.redirect("/login");
}

function removeLastPathSegment(pathname) {
  // Split the pathname into segments based on '/'
  const segments = pathname.split('/').filter(Boolean); // Filter out empty segments

  // Remove the last segment
  segments.pop();

  // Join the remaining segments back into a pathname
  return '/' + segments.join('/');
}
