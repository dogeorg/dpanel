import ApiClient from '/api/client.js';
import { store } from '/state/store.js'

export const sourceRemovalMock = {
  name: '/source/:sourceid',
  method: 'delete',
  group: 'sources',
  res: { success: true }
}

export const sourceAddMock = {
  name: '/source/:sourceid',
  method: 'put',
  group: 'sources',
  res: { success: true }
}

const client = new ApiClient(store.networkContext.apiBaseUrl, store.networkContext)

export async function removeSource(sourceId) {
  return client.delete(`/source/${sourceId}`, { mock: sourceRemovalMock });
}

export async function addSource(location) {
  return client.put(`/source`, { location }, { mock: sourceAddMock });
}