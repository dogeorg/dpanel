import WebSocketClient from "/api/sockets.js";
import { store } from "/state/store.js";
import { isUnauthedRoute } from "/utils/url-utils.js";

async function mockedRecoveryChannelRunner(onMessageCallback) {
  let messageCount = 0;
  const interval = setInterval(() => {
    const mockData = {
      type: "recovery",
      message: `Recovery progress ${messageCount * 10}%`,
      timestamp: new Date().toISOString()
    };
    onMessageCallback({ data: JSON.stringify(mockData) });
    messageCount++;
    
    if (messageCount > 10) {
      clearInterval(interval);
    }
  }, 1000);

  return () => clearInterval(interval);
}

class SocketChannel {
  observers = [];
  reconnectInterval = 500;
  maxReconnectInterval = 10000;
  _logs = [];

  constructor() {
    this.wsClient = null;
    this.isConnected = false;
    this.setupSocketConnection();

    if (!this.isConnected) {
      this.wsClient && this.wsClient.connect();
    }
  }

  setupSocketConnection() {
    if (this.isConnected) {
      return;
    }

    this.wsClient = new WebSocketClient(
      `${store.networkContext.wsApiBaseUrl}/ws/recovery/`,
      store.networkContext,
      mockedRecoveryChannelRunner,
    );

    // Update component state based on WebSocket events
    this.wsClient.onOpen = () => {
      this.isConnected = true;
      this.reconnectInterval = 1000; // reset.
      console.log("RECOVERY WEBSOCKET CONNECTED!!");
      this.notify();
    };

    this.wsClient.onMessage = async (event) => {
      
      let err, data;
      try {
        data = JSON.parse(event.data);
      } catch (err) {
        console.warn("failed to JSON.parse incoming event", event, err);
        err = true;
      }

      if (err || !data) return;

      // Switch on message type
      if (!data.type) {
        console.warn("received an event that lacks an event type", event);
        return;
      }

      switch (data.type) {
        case "recovery":
          console.log("RECOVERY", data.update);
          this._logs = [...this._logs, data.update];
          break;
      }
      this.notify();
    };

    this.wsClient.onError = (event) => {
      console.log("ERRORS", event);
      this.notify();
    };

    this.wsClient.onClose = (event) => {
      console.log("CLOSING");
      this.isConnected = false;
      this.notify();
      this.attemptReconnect();
    };
  }

  attemptReconnect() {
    if (!this.isConnected) {
      setTimeout(() => {
        console.log(`Attempting to reconnect...`);
        this.setupSocketConnection();
        if (!this.isConnected) {
          this.wsClient.connect();
        }
      }, this.reconnectInterval);

      // Increase the reconnect interval until the maximum (eg 10 seconds) is reached
      this.reconnectInterval = Math.min(
        this.reconnectInterval * 1.15,
        this.maxReconnectInterval,
      );
    }
  }

  // Register an observer
  addObserver(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      console.log("OBSERVER ADDED", observer);
    }
  }

  // Remove an observer
  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  // Notify one or all registered observers of a change
  notify(id) {
    for (const observer of this.observers) {
      if (!id) {
        observer.requestUpdate();
      }
      if (id === observer.id) {
        observer.requestUpdate();
      }
    }
  }

  doThing() {
    this.notify();
  }

  // Get current messages
  getMessages() {
    return this._logs || [];
  }

  // Subscribe to message updates
  subscribeToMessages(callback) {
    const messageObserver = {
      requestUpdate: () => {
        callback(this._logs || []);
      }
    };
    this.addObserver(messageObserver);
    return () => this.removeObserver(messageObserver);
  }
}

// Instance holder
let instance;

function getInstance() {
  if (!instance) {
    instance = new SocketChannel();
  }
  return instance;
}

export const recoveryChannel = getInstance();
