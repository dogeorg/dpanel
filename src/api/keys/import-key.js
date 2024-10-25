import ApiClient from '/api/client.js';
import { store } from '/state/store.js'

import { 
  postResponse,
} from './import-key.mocks.js'

const client = new ApiClient(store.networkContext.apiBaseUrl)

export async function postKeyImport(phrase) {
  const res = await client.post(`/keys/import-master`, { phrase }, { mock: postResponse });
  if (res && res.token) {
    store.updateState({ networkContext: { token: res.token }})
  }
  return res
}
