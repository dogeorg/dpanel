import ApiClient from '/api/client.js';
import { store } from '/state/store.js'

import { 
  postResponse,
} from './post-bootstrap.mocks.js'

const client = new ApiClient(store.networkContext.apiBaseUrl, store.networkContext)

export async function postSetupBootstrap(body) {
  const res = await client.post(`/system/bootstrap`, body, { mock: postResponse });
  return res
}
