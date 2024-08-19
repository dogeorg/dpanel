export default class WebSocketClient {
  constructor(url, networkContext, mockEventGenerator) {
    this.url = url;
    this.useMocks = networkContext?.useMocks;
    this.mockEventGenerator = mockEventGenerator;
    this.stopMocking = () => console.log('Stop function not provided.');
    this.socket = null;
    this._isConnected = false;
  }

  connect() {
    if (this._isConnected) {
      console.log('Connection or mock is already running.');
      return;
    }
    if (this.useMocks && this.mockEventGenerator) {
      this.startMocking();
    } else {
      this.startWebSocketConnection();
    }
  }

  startWebSocketConnection() {
    this.socket = new WebSocket(this.url);
    this.socket.onopen = () => {
      this._isConnected = true;
      this.onOpen();
    };
    this.socket.onmessage = this.onMessage.bind(this);
    this.socket.onerror = this.onError.bind(this);
    this.socket.onclose = () => {
      this._isConnected = false;
      this.onClose();
    };
  }

  startMocking() {
    if (this._isConnected) {
      console.log('Mock is already running.');
      return;
    }
    this.stopMocking = this.mockEventGenerator(this.onMessage.bind(this));
    this._isConnected = true;
    this.onOpen();  // Simulate open event for mocks
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
    if (this.useMocks) {
      this.stopMocking();
      this._isConnected = false;
      this.onClose();  // Simulate close event for mocks
    }
  }

  get isConnected() {
    return this._isConnected;
  }

  onOpen() {
    console.log('WebSocket connection or mock started');
  }

  onMessage(message) {
    console.log('Message received:', message.data);
  }

  onError(error) {
    console.error('WebSocket encountered an error:', error);
  }

  onClose() {
    console.log('WebSocket connection or mock stopped');
  }
}