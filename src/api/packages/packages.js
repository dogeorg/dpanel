import ApiClient from '/api/client.js';
import { store } from '/state/store.js'

import { 
  generatePackageList
} from './packages.mocks.js'

const client = new ApiClient('http://localhost:3000', store.networkContext)

export async function getPackageList() {
  return client.get('/manifest/', { mock: generatePackageList(
    1
    // ['Core', 'GigaWallet', 'Identity']
  ) });
}