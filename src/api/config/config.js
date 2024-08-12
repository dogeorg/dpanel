import ApiClient from '/api/client.js';
import { store } from '/state/store.js'

import { 
  postResponse,
  getResponse,
  getAllResponse,
} from './config.mocks.js'

const client = new ApiClient('http://localhost:3000', store.networkContext)

export async function postConfig(pupId, body) {
  return client.post(`/config/${pupId}`, body, { mock: { res: postResponse }});
}

export async function getConfig(pupId) {
  return client.get(`/config/${pupId}`, { mock: { res: getResponse }});
}

export async function getConfigs(pupId) {
  return client.get(`/config`, { mock: { res: getAllResponse }});
}