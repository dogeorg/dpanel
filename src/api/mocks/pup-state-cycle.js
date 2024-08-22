import { asyncTimeout } from "/utils/timeout.js";

const msg = {
  "id": "",
  "error": "",
  "type": "status",
  "update": {}
}

function asStatusUpdate(pupId, newState) {
  const out = { ...msg }
  out.update[pupId] = {
    installation: newState[0],
    status: newState[1]
  }
  return out;
}

export async function performMockCycle(cycle, fn) {
  for (let i = 0; i < cycle.length; i++) {
    await asyncTimeout(8000);
    await fn(asStatusUpdate("ShibeShop", cycle[i]));
  }
}

export const c1 = [
  ["", ""],
  ["installing", ""],
  ["unready", ""],
  ["ready", ""]
];

export const c2 = [
  ["", ""],
  ["installing", ""],
  ["ready", "configure"],
];

export const c3 = [
  ["", ""],
  ["installing", ""],
  ["ready", "configure"],
];

export const c4 = [
  ["", ""],
  ["installing", ""],
  ["broken", ""],
  ["ready", "needs_config"],
  ["ready", "starting"],
  ["ready", "enabled"],
  ["ready", "stopping"],
  ["ready", "disabled"],
];

export const c5 = [
  ["ready", "starting"],
  ["ready", "running"],
  ["ready", "stopping"],
  ["ready", "stopped"]
]
