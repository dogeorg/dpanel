import { asyncTimeout } from "/utils/timeout.js";

export const simulateActivity = async (store) => {
  // simulate some activity.
  await asyncTimeout(2000);
  store.updateState({ jobContext: { count: 1 }});

  await asyncTimeout(2000);
  store.updateState({ jobContext: { count: 2 }});

  await asyncTimeout(200);
  store.updateState({ jobContext: { count: 4 }});

  await asyncTimeout(5000);
  store.updateState({ jobContext: { count: 3 }});

  await asyncTimeout(2000);
  store.updateState({ jobContext: { count: 2 }});

  await asyncTimeout(100);
  store.updateState({ jobContext: { count: 1 }});

  await asyncTimeout(3000);
  store.updateState({ jobContext: { count: 0 }});
}