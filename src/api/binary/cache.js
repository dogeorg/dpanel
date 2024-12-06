import ApiClient from '/api/client.js';
import { store } from '/state/store.js'

import { 
  postResponse,
} from './cache.mocks.js'

const client = new ApiClient(store.networkContext.apiBaseUrl)

export async function setBinaryCacheState(body) {
  return client.post(`/system/binarycache/state`, body, { mock: postResponse });
}