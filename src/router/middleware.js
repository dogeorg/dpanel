// import { getManifest } from "/api/manifest/index.js";
import { store } from '/state/store.js';

export const wrapActions = (...actions) => async (context, commands) => {
  // Execute each action in sequence
  for (const action of actions) {
    const result = await action(context, commands);
    // If an action returns a command (like redirect), return it immediately
    if (result instanceof commands.Command) {
      return result;
    }
  }
  // After all actions have completed, call setMenu
  return setMenu(context, commands);
};

// Example middleware
export function logPathMiddleware(context, commands) {
  console.log('Navigating to path:', context.pathname);
  return undefined; // Proceed with the navigation
}

// When navigating to /pup/*, fetch the app context and set on state.
export async function loadPupContext(context, commands) {
  try {
    const pupId = context.pathname.replace('/pup/', '')
    // TODO: broken.
    const manifest = false /*await getManifest(pupId);*/
    
    if (!manifest || !manifest.source) {
      throw new Error('manifest empty')
    }

    store.updateState({ pupContext: { manifest }})
    return undefined;
  } catch (error) {
    console.error('Error fetching manifest:', error);
  }

  return commands.redirect('/error?type="pup-loading-error');
}

function setMenu(context, commands) {
  store.updateState({ appContext: {
    pathname: context.pathname,
  }})
  return undefined;
}