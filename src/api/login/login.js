import ApiClient from '/api/client.js';
import { store } from '/state/store.js'

import { 
  postResponse,
} from './login.mocks.js'

const client = new ApiClient('http://localhost:3000', store.networkContext)

export async function postLogin(body) {
  const res = await client.post(`/auth/login`, body, { mock: { res: postResponse }});
  if (res && res.token) {
    store.updateState({ networkContext: { token: res.token }})
  }
  return res
}
