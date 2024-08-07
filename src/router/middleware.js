// import { getManifest } from "/api/manifest/index.js";
import { store } from "/state/store.js";
import { pkgController } from "/controllers/package/index.js";
import { getBootstrap } from "/api/bootstrap/bootstrap.js";
import { getRouter } from "/router/router.js";

export const wrapActions =
  (...actions) =>
  async (context, commands) => {
    // Execute each action in sequence
    // const route = context.resolver?.R?.route || false
    const route = {}
    for (const action of actions) {
      const result = await action(context, commands, route);
      // If an action returns a command (like redirect), return it immediately
      if (result) {
        return result;
      }
    }
    // Do the following for all route changes.
    // setTitle(context, commands);
    // setTravel(context, commands);
    // applyTransitionEffects(context, commands, route)
    return undefined
  };

// Example middleware
export function logPathMiddleware(context, commands) {
  console.log("Navigating to path:", context.pathname);
  return undefined; // Proceed with the navigation
}

export function fade(context, commands, route) {

  const r = getRouter().router;
  const pathStack = store.appContext.pathStack || [];

  // Determine if this is a backward navigation
  const outletWrapper = r.getOutletWrapper();
  const isBackward = outletWrapper.classList.contains('exiting');
  const isLandingPage = !!(store.appContext.pageCount === 1)

  // Clear animation classes on backward stack navigation
  if (isBackward) {
    outletWrapper.classList.remove('entering', 'exiting');
  }

  // Apply animation class on forward navigation if route declares.
  if (!isBackward) {
    outletWrapper.classList.add('entering');
  }

  return undefined; // Proceed with the navigation
}

export async function loadPup(context, commands) {

  const pupId = context.params.pup

  if (!pupId) {
    return undefined;
  }

  try {
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
        pageTitle: context.params.pup || manifest.package,
        pageAction: "back",
      }
    });

  } catch (error) {
    console.error("Error fetching manifest:", error);
  }

  return undefined
}

export function setTravel(context, commands) {
  // const r = getRouter().router;

  // Push the new path to the pathStack
  const pathStack = store.appContext.pathStack || [];
  pathStack.push(context.pathname);

  const dedupedStack = pathStack.filter((path, index, array) => {
    // Check if the current path is the same as the next path
    return index === 0 || path !== array[index - 1];
  });

  const pageCount = store.appContext.pageCount + 1;

  store.updateState({
    appContext: {
      pathname: context.pathname,
      upwardPathname: removeLastPathSegment(context.pathname),
      pathStack: dedupedStack,
      menuVisible: false, // Collapses the menu for mobile on menu selection
      pageCount
    },
  });

  return undefined;
}

export function setTitle(context, commands) {
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

function getSegmentBeforeTerm(path, term) {
    const segments = path.split('/');
    const uiIndex = segments.indexOf(term);

    if (uiIndex > 0) {
        return segments[uiIndex - 1];
    } else {
        return null;
    }
}