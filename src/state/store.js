import { isUnauthedRoute, hasFlushParam } from "/utils/url-utils.js";

class Store {
  subscribers = [];

  constructor() {
    this.appContext = this.appContext || {
      orienation: "landscape",
      menuVisible: false,
      pathname: "/",
      pageTitle: "",
      pageAction: "",
      pageCount: 0,
      navigationDirection: ""
    };
    this.networkContext = this.networkContext || {
      apiBaseUrl: `${window.location.protocol}//${window.location.hostname}:3000`,
      wsApiBaseUrl: `ws://${window.location.hostname}:3000`,
      overrideBaseUrl: false,
      overrideSocketBaseUrl: false,
      useMocks: false,
      forceFailures: false,
      forceDelayInSeconds: 0,
      reqLogs: false,
      status: "online",
      token: false,
      demoSystemPrompt: "",
      logStatsUpdates: false,
      logStateUpdates: false,
      reflectorHost: `https://reflector.dogecoin.org`
    };
    this.pupContext = {
      computed: null,
      def: null,
      state: null,
      stats: null,
      ready: false,
      result: null
    };
    this.promptContext = {
      display: false,
      name: "transaction",
    };
    this.setupContext = {
      hashedPassword: null,
      view: null,
    };

    // Hydrate state from localStorage unless flush parameter is present.
    if (!isUnauthedRoute() && !hasFlushParam()) {
      this.hydrate();
    }
    if (hasFlushParam()) {
      window.location = window.location.origin + window.location.pathname;
    }
  }

  subscribe(controller) {
    this.subscribers.push(controller);
  }

  notifySubscribers() {
    for (const controller of this.subscribers) {
      controller.stateChanged();
    }
  }

  hydrate() {
    // Check if localStorage is supported and accessible
    if (this.supportsLocalStorage()) {
      try {
        // Attempt to parse the saved state from localStorage
        const savedState = JSON.parse(localStorage.getItem("storeState"));
        if (savedState) {
          this.networkContext = savedState.networkContext;
          // Load other slices as needed
        }
      } catch (error) {
        console.warn(
          "Failed to parse the store state from localStorage. Using defaults.",
        );
      }
    }
  }

  persist() {
    if (this.supportsLocalStorage()) {
      try {
        const stateToPersist = {
          appContext: this.appContext,
          networkContext: this.networkContext,
          // Include other slices of state as needed
        };
        localStorage.setItem("storeState", JSON.stringify(stateToPersist));
      } catch (error) {
        console.warn("Failed to save the store state to localStorage.");
      }
    }
  }

  supportsLocalStorage() {
    try {
      const testKey = "testLocalStorage";
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  clearContext(contexts) {
    if (!contexts) {
      return;
    }

    contexts.forEach((context) => {
      if (this[context]) {
        this[context] = {};
      }
    });

    this.persist();
    this.notifySubscribers();
  }

  updateState(partialState) {
    // Update the state properties with the partial state provided
    if (partialState.appContext) {
      this.appContext = { ...this.appContext, ...partialState.appContext };
    }
    if (partialState.networkContext) {
      this.networkContext = {
        ...this.networkContext,
        ...partialState.networkContext,
      };
    }
    if (partialState.pupContext) {
      this.pupContext = { ...this.pupContext, ...partialState.pupContext };
    }
    if (partialState.promptContext) {
      this.promptContext = {
        ...this.promptContext,
        ...partialState.promptContext,
      };
    }
    if (partialState.setupContext) {
      this.setupContext = {
        ...this.setupContext,
        ...partialState.setupContext,
      };
    }
    // Other slices..

    // After state is updated, persist it and notify subscribers;
    this.persist();
    this.notifySubscribers();
  }
}

// Important:: Export as a singleton
export const store = new Store();
