import ApiClient from "/api/client.js";
import { store } from "/state/store.js";

import { getSSHPublicKeysResponse } from "./sshkeys.mocks.js";

const client = new ApiClient(store.networkContext.apiBaseUrl);

export async function getSSHPublicKeys() {
  const res = await client.get(`/system/ssh/keys`, { mock: getSSHPublicKeysResponse });
  return res;
}
