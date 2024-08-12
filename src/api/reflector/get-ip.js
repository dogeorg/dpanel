import ApiClient from '/api/client.js';
import { store } from '/state/store.js'

import { 
  getResponse,
} from './get-ip.mocks.js'

const client = new ApiClient('http://localhost:3000', store.networkContext)

export async function getIP() {
  const res = await client.get(`/reflector/ip`, { mock: getResponse });
  return res
}
