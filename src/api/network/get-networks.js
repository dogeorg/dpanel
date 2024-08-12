import ApiClient from '/api/client.js';
import { store } from '/state/store.js'

import { 
  getResponse,
} from './get-networks.mocks.js'

const client = new ApiClient('http://localhost:3000', store.networkContext)

export async function getNetworks(body) {
  const res = await client.get(`/auth/networks`, { mock: { res: getResponse }});
  return res
}
