import ApiClient from "/api/client.js";
import { store } from "/state/store.js";

import { getResponse, postInstallLocationResponse, postStorageLocationResponse } from "./disks.mocks.js";

const client = new ApiClient(store.networkContext.apiBaseUrl);

export async function getDisks() {
  const res = await client.get(`/system/disks`, {
    mock: getResponse,
    noLogoutRedirect: true,
  });
  return res;
}

export async function postInstallToDisk({ disk, secret }) {
  const res = await client.post(`/system/install`, { disk, secret }, {
    mock: postInstallLocationResponse,
    noLogoutRedirect: true,
  });
  return res;
}

export async function setStorageDisk({ disk }) {
  const res = await client.post(`/system/storage`, { disk }, {
    mock: postStorageLocationResponse,
    noLogoutRedirect: true,
  });
  return res;
}
