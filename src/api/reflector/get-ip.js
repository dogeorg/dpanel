import ApiClient from '/api/client.js';

import { 
  getResponse,
} from './get-ip.mocks.js'

export async function getIP(reflectorHost, reflectorToken) {
  const client = new ApiClient(reflectorHost, {
    // Set externalAPI so we don't leak our authentication token to the reflector.
    externalAPI: true
  })

  const res = await client.get(`/${reflectorToken}`, { mock: getResponse });
  return res
}
