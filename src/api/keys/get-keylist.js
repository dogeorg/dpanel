import ApiClient from "/api/client.js";
import { store } from "/state/store.js";

import { getResponse } from "./get-keylist.mocks.js";

const client = new ApiClient("http://localhost:3000", store.networkContext);

export async function getKeylist() {
  const res = await client.get(`/keyring/list`, { mock: getResponse });
  return res;
}
