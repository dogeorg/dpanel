import ApiClient from '/api/client.js';
import { store } from '/state/store.js';
import { pkgController } from '/controllers/package/index.js';

import { 
  storeListingMock
} from './sources.mocks.js'

const client = new ApiClient(store.networkContext.apiBaseUrl, store.networkContext)

export async function getStoreListing() {
  return client.get('/sources/store', { mock: storeListingMock });
}

export async function refreshStoreListing() {
  return pkgController.setStoreData(await getStoreListing());
}