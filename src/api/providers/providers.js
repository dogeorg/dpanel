import ApiClient from '/api/client.js';
import { store } from '/state/store.js'

import { 
  getProvidersResponse,
  setProviderResponse,
} from './providers.mocks.js'

const client = new ApiClient(store.networkContext.apiBaseUrl)

export async function getProviders(pupId) {
  const res = await client.get(`/providers/${pupId}`, { mock: getProvidersResponse });
  return res
}

export async function setProvider(pupId, body) {
  const res = await client.post(`/providers/${pupId}`, body, { 
    mock: setProviderResponse 
  });
  return res
}

