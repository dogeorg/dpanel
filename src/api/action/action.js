import ApiClient from '/api/client.js';
import { store } from '/state/store.js'

import { 
  mock,
} from './action.mocks.js'

const client = new ApiClient('http://localhost:3000', store.networkContext)

export async function stopPup(pupId, body) {
  return client.post(`/action/${pupId}/stop`, body, { mock });
}

export async function startPup(pupId, body) {
  return client.post(`/action/${pupId}/start`, body, { mock });
}