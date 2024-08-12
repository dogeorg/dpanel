import ApiClient from '/api/client.js';
import { store } from '/state/store.js'

import { 
  postResponse,
} from './create-key.mocks.js'

const client = new ApiClient('http://localhost:3000', store.networkContext)

export async function createKey(password) {
  const res = await client.post(`/keyring/create`, { password }, { mock: { res: postResponse }});
  if (res && res.token) {
    store.updateState({ networkContext: { token: res.token }})
  }
  return res
}
