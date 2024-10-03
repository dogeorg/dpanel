import ApiClient from '/api/client.js';
import { store } from '/state/store.js';
import { pkgController } from '/controllers/package/index.js';

import { 
  storeListingMock
} from './sources.mocks.js'

const client = new ApiClient(store.networkContext.apiBaseUrl)

export async function getStoreListing(shouldFlush = false) {
  const url = shouldFlush ? '/sources/store?refresh=true' : '/sources/store';
  return client.get(url, { mock: storeListingMock });
}

export async function refreshStoreListing(shouldFlush = false) {
  return pkgController.setStoreData(await getStoreListing(shouldFlush));
}