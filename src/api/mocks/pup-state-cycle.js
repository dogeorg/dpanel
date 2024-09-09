import { asyncTimeout } from "/utils/timeout.js";

const stateMsg = {
  "id": "",
  "error": "",
  "type": "pup",
  "update": {}
}

const statsMsg = {
  "id": "",
  "error": "",
  "type": "stats",
  "update": {}
}

function asState(pupId, newState) {
  const out = { ...stateMsg }
  out.update = {
    id: pupId,
    manifest: { meta: { name: pupId }},
    source: { name: "fdn", },
    ...newState,
  }
  return out;
}

function asStats(pupId, newStats) {
  const out = { ...statsMsg }
  out.update[pupId] = {
    ...newStats
  }
  return out;
}

export async function performMockCycle(fn) {
  await asyncTimeout(3000);
  // await fn(asStatsUpdate("ShibeShop", cycle[i]));

  // Install the pup
  await fn(asState("ShibeShop", { installation: "installing", enabled: true }));
  await asyncTimeout(8000);

  // After install, pup starts
  await fn(asState("ShibeShop", { installation: "ready" }));
  await fn(asStats("ShibeShop", { status: "starting" }));
  await asyncTimeout(8000);

  // At users discretion, they stop pup
  await fn(asStats("ShibeShop", { status: "stopping" }));
  await asyncTimeout(8000);
  await fn(asStats("ShibeShop", { status: "stopped" }));
  await fn(asStats("ShibeShop", { enabled: false }));

  // 
  // await asyncTimeout(8000);
}

export const PUP_LIFECYCLE = [
  "installation"
]

