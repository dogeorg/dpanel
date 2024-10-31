import { sysController } from "/controllers/system/index.js";
import { store } from "/state/store.js";

export function emitSyntheticUpdateAvailable() {
  const hasUpdateEvent = {
    type: 'system-state',
    data: {
      update: {
        updateAvailable: !store.getContext("sys").updateAvailable
      }
    }
  }
  
  sysController.ingestSystemStateUpdate(hasUpdateEvent.data)
}