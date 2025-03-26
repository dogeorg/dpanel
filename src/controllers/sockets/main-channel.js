import WebSocketClient from "/api/sockets.js";
import { store } from "/state/store.js";
import { pkgController } from "/controllers/package/index.js";
import { sysController } from "/controllers/system/index.js";
import { asyncTimeout } from "/utils/timeout.js";
import { performMockCycle, c1, c4, c5, mockInstallEvent } from "/api/mocks/pup-state-cycle.js";
import { isUnauthedRoute } from "/utils/url-utils.js";

async function mockedMainChannelRunner(onMessageCallback) {
  if (store.networkContext.demoSystemPrompt) {
    setTimeout(() => {
      const mockData = {
        type: "ShowPrompt",
        name: store.networkContext.demoSystemPrompt,
      };
      onMessageCallback({ data: JSON.stringify(mockData) });
    }, 2000);
  }

  if (store.networkContext.demoInstallPup) {
    setTimeout(() => {
      onMessageCallback({
        data: JSON.stringify(installEvent)
      })
    }, 3000)
  }

  if (store.networkContext.demoPupLifecycle) {
    await performMockCycle(c5, (statusUpdate) => onMessageCallback({ data: JSON.stringify(statusUpdate) }))
  }
}

class SocketChannel {
  observers = [];
  reconnectInterval = 500;
  maxReconnectInterval = 10000;
  recoveryLogs = ["Connecting to WebSocket"];

  constructor() {
    console.log("[WebSocket] Initializing SocketChannel");
    this.wsClient = null;
    this.isConnected = false;
    console.log("[WebSocket] Current state:", {
      isConnected: this.isConnected,
      reconnectInterval: this.reconnectInterval,
      maxReconnectInterval: this.maxReconnectInterval,
      observersCount: this.observers.length
    });
    
    this.setupSocketConnection();

    if (!this.isConnected) {
      console.log("[WebSocket] Initial connection failed, attempting to connect");
      this.wsClient && this.wsClient.connect();
    }

    console.log("[WebSocket] Constructor completed");
  }

  setupSocketConnection() {
    console.log("[WebSocket] Starting setupSocketConnection");
    console.log("[WebSocket] Current connection state:", {
      isConnected: this.isConnected,
      wsClient: this.wsClient ? "exists" : "null",
      networkContext: store.networkContext
    });

    if (this.isConnected) {
      console.log("[WebSocket] Already connected, skipping setup");
      return;
    }

    if (isUnauthedRoute()) {
      console.log("[WebSocket] Unauthenticated route detected, skipping setup");
      return;
    }

    const wsUrl = `${store.networkContext.wsApiBaseUrl}/ws/state/`;
    console.log("[WebSocket] Creating new WebSocket client with URL:", wsUrl);
    
    this.wsClient = new WebSocketClient(
      wsUrl,
      store.networkContext,
      mockedMainChannelRunner,
    );

    // Update component state based on WebSocket events
    this.wsClient.onOpen = () => {
      console.log("[WebSocket] Connection opened successfully");
      this.isConnected = true;
      this.reconnectInterval = 1000; // reset.
      console.log("[WebSocket] Connection state updated:", {
        isConnected: this.isConnected,
        reconnectInterval: this.reconnectInterval
      });
      this.recoveryLogs = [...this.recoveryLogs, "Websocket connected"];
      this.notify();
    };

    this.wsClient.onMessage = async (event) => {
      console.log("[WebSocket] Received message:", event);
      
      let err, data;
      try {
        data = JSON.parse(event.data);
        console.log("[WebSocket] Parsed message data:", data);
      } catch (err) {
        console.error("[WebSocket] Failed to parse incoming event:", {
          error: err,
          event: event
        });
        err = true;
      }

      if (err || !data) {
        console.log("[WebSocket] Skipping message processing due to error or missing data");
        return;
      }

      // Switch on message type
      if (!data.type) {
        console.warn("[WebSocket] Received event without type:", event);
        return;
      }

      console.log("[WebSocket] Processing message type:", data.type);

      switch (data.type) {
        case "pup":
          // emitted on state change (eg: installing, ready)
          if (store.networkContext.logStateUpdates) {
                console.log(`##-STATE-## installation: ${data.update.installation}`, { payload: data.update });
              }
          pkgController.updatePupModel(data.update.id, data.update)
          break;

        case "stats":
          // emitted on an interval (contains current status and vitals)
          if (data && data.update && Array.isArray(data.update)) {
            data.update.forEach((statsUpdatePayload) => {
              if (store.networkContext.logStatsUpdates) {
                console.log('--STATS--', statsUpdatePayload.status, { payload: statsUpdatePayload });
              }
              pkgController.updatePupStatsModel(statsUpdatePayload.id, statsUpdatePayload)
            });
          }
          break;

        case "action":
          // emitted in response to an action
          await asyncTimeout(500); // Why?
          pkgController.resolveAction(data.id, data);
          break;

        case "prompt": // synthetic (client side only)
          store.updateState({
            promptContext: {
              display: true,
              name: data.name,
            },
          });
          break;

        case "progress":
          if (store.networkContext.logProgressUpdates) {
            console.log("--PROGRESS", data);
          }
          pkgController.ingestProgressUpdate(data);
          break;

        case "system-state":
          sysController.ingestSystemStateUpdate(data)
          break;

        case "recovery":
          console.log("RECOVERY", data.update);
          this.recoveryLogs = [...this.recoveryLogs, data.update];
          break;
      }
      this.notify();
    };

    this.wsClient.onError = (event) => {
      console.error("[WebSocket] Connection error:", event);
      this.notify();
    };

    this.wsClient.onClose = (event) => {
      console.log("[WebSocket] Connection closing:", {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean
      });
      this.isConnected = false;
      this.notify();
      this.attemptReconnect();
    };
  }

  attemptReconnect() {
    console.log("[WebSocket] Attempting reconnection:", {
      currentInterval: this.reconnectInterval,
      maxInterval: this.maxReconnectInterval,
      isConnected: this.isConnected
    });

    if (!this.isConnected) {
      setTimeout(() => {
        console.log(`[WebSocket] Executing reconnection attempt after ${this.reconnectInterval}ms`);
        this.setupSocketConnection();
        if (!this.isConnected) {
          console.log("[WebSocket] Connection still not established, calling connect()");
          this.wsClient.connect();
        }
      }, this.reconnectInterval);

      // Increase the reconnect interval until the maximum (eg 10 seconds) is reached
      this.reconnectInterval = Math.min(
        this.reconnectInterval * 1.15,
        this.maxReconnectInterval,
      );
      console.log("[WebSocket] Updated reconnect interval:", this.reconnectInterval);
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
    getRecoveryLogs() {
      return this.recoveryLogs || [];
    }
  
    // Subscribe to message updates
    subscribeToRecoveryLogs(callback) {
      const messageObserver = {
        requestUpdate: () => {
          callback(this.recoveryLogs || []);
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

export const mainChannel = getInstance();
