// import { getManifest } from "/api/manifest/index.js";
import { store } from "/state/store.js";
import { pkgController } from "/controllers/package/index.js";
import { getBootstrap } from "/api/bootstrap/bootstrap.js";

export async function loadPup(context, commands) {
  const pupId = context.params.pup
  if (!pupId) { return undefined; }

  try {
    // ensure bootstrap (temporary)
    const res = await getBootstrap();
    pkgController.setData(res);

    const pup = pkgController.getPup(pupId);
    const { manifest, state, computed } = pup;

    if (!manifest) {
      throw new Error("manifest empty");
    }

    store.updateState({
      pupContext: { manifest, state, computed },
    });

    if (context.route.dynamicTitle) {
      context.route.pageTitle = manifest.package;
      context.route.pageAction = "back";
    }

  } catch (error) {
    console.error("Error fetching manifest:", error);
  }

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

export function asPage(context, commands) {
  const { componentClass: ComponentClass, pageTitle, pageAction } = context.route;

  // Create instance of page-container
  const PageContainer = customElements.get('page-container');
  const pageContainer = new PageContainer()
  
  // Set properties on the page-container per the route definition.
  pageContainer.pageTitle = pageTitle;
  pageContainer.pageAction = pageAction;
  
  // Wrap route component in page-container.
  const childComponent = new ComponentClass();
  pageContainer.appendChild(childComponent);

  // Override route component withly newly wrapped component
  context.route.componentInstance = pageContainer;
}
