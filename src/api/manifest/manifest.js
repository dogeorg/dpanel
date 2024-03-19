import ApiClient from '/api/client.js';
import { store } from '/state/store.js'

import { 
  getMockManfiestListPayload,
  getMockManifestPayloadAppA,
  getMockManifestPayloadAppB
} from './manifest.mocks.js'

const client = new ApiClient('http://localhost:3000', store.networkContext)

export async function getManifests() {
  return client.get('/manifests', { mock: getMockManfiestListPayload });
}

export async function getManifest(id) {
  return client.get(`/manifest/${id}`, { mock: (id) => {
    if (id.includes('tim')) return getMockManifestPayloadAppA;
    if (id.includes('ben')) return getMockManifestPayloadAppB;
    throw Error(`[Mock issue] but mock not found for id: ${id}`)
  }});
}