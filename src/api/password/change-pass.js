import ApiClient from '/api/client.js';
import { store } from '/state/store.js'

import { 
  postResponse,
} from './change-pass.mocks.js'

const client = new ApiClient(store.networkContext.apiBaseUrl, store.networkContext)

export async function postChangePass(body) {
  const res = await client.post(`/auth/change-pass`, body, { mock: postResponse });
  if (res && res.token) {
    store.updateState({ networkContext: { token: res.token }})
  }
  return res
}
