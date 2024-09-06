// import { getManifest } from "/api/manifest/index.js";
import { store } from "/state/store.js";
import { pkgController } from "/controllers/package/index.js";
import { getBootstrapV2 } from "/api/bootstrap/bootstrap.js";
import { getStoreListing } from "/api/sources/sources.js";

export async function loadPup(context, commands) {
  const pupId = context.params.pup
  if (!pupId) { return undefined; }
  try {
    // ensure bootstrap (temporary)
    const res = await getBootstrapV2();
    pkgController.setData(res);

    const pup = pkgController.getPup(pupId);

    if (!pup || !pup.manifest) {
      throw new Error("manifest empty");
    }

    store.updateState({
      pupContext: { ...pup, ready: true, result: 200 },
    });

  } catch (error) {
    console.error("Error fetching manifest:", error);
  }

  return undefined
}

export async function loadPupDefinition(context, commands) {
  const sourceId = decodeURIComponent(context.params.source);
  const pupName = decodeURIComponent(context.params.name);
  if (!sourceId || !pupName) { return undefined; }

  try {
    // ensure bootstrap (temporary)
    const res = await getStoreListing();
    pkgController.ingestAvailablePupDefs(res);
    const pup = pkgController.getPupDefinition(sourceId, pupName);

    if (!pup) {
      throw new Error("missing pup definition");
    }

    store.updateState({
      pupDefinitionContext: { ...pup, ready: true, result: 200 }
    });

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
  if (context.route.dynamicTitle) {
    context.route.pageTitle = decodeURIComponent(context.params.name);
    context.route.pageAction = "back";
  }

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
