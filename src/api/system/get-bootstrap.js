import ApiClient from '/api/client.js';
import { store } from '/state/store.js'

import { 
  getResponse,
} from './get-bootstrap.mocks.js'

const client = new ApiClient(store.networkContext.apiBaseUrl)

export async function getSetupBootstrap(options) {
  const res = await client.get(`/system/bootstrap`, { ...options, mock: getResponse });
  return res
}
