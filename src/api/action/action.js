import ApiClient from '/api/client.js';
import { store } from '/state/store.js'

import { 
  startMock,
  stopMock,
  installMock,
  uninstallMock,
} from './action.mocks.js'

const client = new ApiClient('http://localhost:3000', store.networkContext)

export async function installPup(pupId, body) {
  return client.post(`/action/${pupId}/install`, body, { mock: installMock });
}

export async function uninstallPup(pupId, body) {
  return client.post(`/action/${pupId}/uninstall`, body, { mock: uninstallMock });
}

export async function startPup(pupId, body) {
  return client.post(`/action/${pupId}/enable`, body, { mock: startMock });
}

export async function stopPup(pupId, body) {
  return client.post(`/action/${pupId}/disable`, body, { mock: stopMock });
}

export function pickAndPerformPupAction(pupId, action) {
  switch(action) {
    case 'install':
      return installPup(pupId);
      break;
    case 'uninstall':
      return uninstallPup(pupId);
      break;
    case 'start':
      return startPup(pupId);
      break;
    case 'stop':
      return stopPup(pupId);
      break;
    default:
      console.warn('unsupported pup action requested', action);
  }
}
