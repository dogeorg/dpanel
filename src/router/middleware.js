import { getManifest } from "/api/manifest/index.js";
import { store } from '/state/store.js';

// Example middleware
export function logPathMiddleware(context, commands) {
  console.log('Navigating to path:', context.pathname);
  return undefined; // Proceed with the navigation
}

// When navigating to /pup/*, fetch the app context and set on state.
export async function loadPupContext(context, commands) {
  try {
    const pupId = context.pathname.replace('/pup/', '')
    const manifest = await getManifest(pupId);
    
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