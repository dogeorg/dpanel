import ApiClient from '/api/client.js';
import { store } from '/state/store.js'

import { 
  postResponse,
} from './config.mocks.js'

const client = new ApiClient('http://localhost:3000', store.networkContext)

export async function postConfig(pupId, body) {
  return client.post(`/config/${pupId}`, body, { mock: postResponse });
}