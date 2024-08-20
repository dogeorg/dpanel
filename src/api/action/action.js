import ApiClient from '/api/client.js';
import { store } from '/state/store.js'

import { 
  startMock,
  installMock,
} from './action.mocks.js'

const client = new ApiClient('http://localhost:3000', store.networkContext)

export async function stopPup(pupId, body) {
  return client.post(`/action/${pupId}/stop`, body, { mock: startMock });
}

export async function startPup(pupId, body) {
  return client.post(`/action/${pupId}/start`, body, { mock: startMock });
}

export async function installPup(pupId, body) {
  return client.post(`/action/${pupId}/install`, body, { mock: installMock });
}

export function pickAndPerformPupAction(pupId, action) {
  switch(action) {
    case 'install':
      return installPup(pupId);
      break;
    case 'start':
      return startPup(pupId);
      break;
    default:
      console.warn('unsupported pup action requested', action);
  }
}
