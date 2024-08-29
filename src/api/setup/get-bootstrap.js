import ApiClient from '/api/client.js';
import { store } from '/state/store.js'

import { 
  getResponse,
} from './get-bootstrap.mocks.js'

const client = new ApiClient('http://localhost:3000', store.networkContext)

export async function getSetupBootstrap(body) {
  const res = await client.get(`/system/bootstrap`, { mock: getResponse });
  return res
}
