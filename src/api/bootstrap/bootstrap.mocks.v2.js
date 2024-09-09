import { generateManifestsV2 } from "../manifest/manifest.mocks.v2.js";
import { generateStatesV2 } from "../states/states.mocks.js"

export const mockV2 = {
  name: '/system/bootstrap',
  method: 'get',
  group: 'system',
  res: generateBootstrapV2
}

function generateBootstrapV2() {
  const manifests = generateManifestsV2(['Dogeboxd', 'Core', 'GigaWallet']);
  const states = generateStatesV2(manifests);
  const setupFacts = generateSetupFacts();
  const stats = generateRandomStatsV2(states);

  return {
    manifests,
    setupFacts,
    states,
    stats,
  }
}

function generateSetupFacts() {
  return { hasCompletedInitialConfiguration: true, hasConfiguredNetwork: true, hasGeneratedKey: true };
}

function generateRandomStatsV2(states) {
  return Object.keys(states).reduce((stats, stateId) => {
    stats[stateId] = {
      id: stateId,
      // status: Math.random() > 0.5 ? "running" : "stopped",
      status: "stopped",
      status_cpu: generateRandomValues(),
      status_disk: generateRandomValues(),
      status_mem: generateRandomValues(),
    };
    return stats;
  }, {});
}

function generateRandomValues() {
  return {
    Head: Math.floor(Math.random() * 32),
    Values: Array.from({ length: 32 }, () => Math.floor(Math.random() * 100)),
  };
}