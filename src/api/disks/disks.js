import ApiClient from "/api/client.js";
import { store } from "/state/store.js";

import { getResponse, postResponse } from "./disks.mocks.js";

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
    mock: postResponse,
    noLogoutRedirect: true,
  });
  return res;
}
