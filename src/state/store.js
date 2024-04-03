class Store {

  subscribers = [];

  constructor() {
    this.hydrate();
    // If there's no persisted state, initialize with defaults.
    this.appContext = this.appContext || {
      // Define application state here
      orienation: 'landscape'
    };
    this.networkContext = this.networkContext || {
      // Define network state here
      useMocks: false,
      forceFailures: false,
      forceDelayInSeconds: 3,
      reqLogs: true,
      status: 'online'
    };
    this.pupContext = {
      // Define pup state here
      manifest: {}
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
        const savedState = JSON.parse(localStorage.getItem('storeState'));
        if (savedState) {
          this.appContext = savedState.appContext;
          this.networkContext = savedState.networkContext;
          // Load other slices as needed
        }
      } catch (error) {
        console.warn('Failed to parse the store state from localStorage. Using defaults.');
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
        localStorage.setItem('storeState', JSON.stringify(stateToPersist));
      } catch (error) {
        console.warn('Failed to save the store state to localStorage.');
      }
    }
  }

  supportsLocalStorage() {
    try {
      const testKey = 'testLocalStorage';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  updateState(partialState) {
    // Update the state properties with the partial state provided
    if (partialState.appContext) {
      this.appContext = { ...this.appContext, ...partialState.appContext };
    }
    if (partialState.networkContext) {
      this.networkContext = { ...this.networkContext, ...partialState.networkContext };
    }
    if (partialState.pupContext) {
      this.pupContext = { ...this.pupContext, ...partialState.pupContext };
    }
    // Other slices..

    // After state is updated, persist it and notify subscribers;
    this.persist();
    this.notifySubscribers();
  }
}

// Important:: Export as a singleton
export const store = new Store();
