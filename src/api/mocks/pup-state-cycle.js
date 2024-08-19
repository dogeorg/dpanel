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
  console.log('OUT!', out);
  return out;
}

export async function performMockCycle(cycle, fn) {
  for (let i = 0; i < cycle.length; i++) {
    await asyncTimeout(3000);
    await fn(asStatusUpdate("ShibeShop", cycle[i]));
  }
}

export const c1 = [
  ["installing", ""],
  ["installing", ""],
  ["installed", "starting"],
  ["installed", "enabled"],
];

export const c2 = [
  ["", ""],
  ["installing", ""],
  ["installed", "configure"],
];

export const c3 = [
  ["", ""],
  ["installing", ""],
  ["installed", "configure"],
];

export const c4 = [
  ["", ""],
  ["installing", ""],
  ["broken", ""],
  ["installed", "needs_config"],
  ["installed", "starting"],
  ["installed", "enabled"],
  ["installed", "stopping"],
  ["installed", "disabled"],
];

export const c5 = [
  ["installed", "starting"],
  ["installed", "starting"],
  ["installed", "enabled"],
]