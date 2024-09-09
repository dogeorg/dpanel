import ApiClient from '/api/client.js';
import { store } from '/state/store.js'

import { 
  generateManifests
} from './manifest.mocks.js'

const client = new ApiClient(store.networkContext.apiBaseUrl, store.networkContext)

export async function getManifest() {
  return client.get('/manifest/', { mock: generateManifests });
}