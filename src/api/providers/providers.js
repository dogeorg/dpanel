import ApiClient from '/api/client.js';
import { store } from '/state/store.js'

import { 
  getProvidersResponse,
} from './providers.mocks.js'

const client = new ApiClient(store.networkContext.apiBaseUrl, store.networkContext)

export async function getProviders(pupId) {
  const res = await client.get(`/providers/${pupId}`, { mock: getProvidersResponse });
  return res
}
