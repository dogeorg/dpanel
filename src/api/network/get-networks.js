import ApiClient from '/api/client.js';
import { store } from '/state/store.js'

import { 
  getResponse,
} from './get-networks.mocks.js'

const client = new ApiClient(store.networkContext.apiBaseUrl, store.networkContext)

export async function getNetworks(body) {
  const res = await client.get(`/system/network/list`, { mock: getResponse });
  return res
}
