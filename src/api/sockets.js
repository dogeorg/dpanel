export default class WebSocketClient {
  constructor(url, networkContext, mockEventGenerator) {
    this.url = url;
    this.mockEventGenerator = mockEventGenerator;
    this.networkContext = networkContext;
    this.socket = null;
    this.stopMockGeneration = null;
  }

  connect() {
    if (this.networkContext.useMocks && this.mockEventGenerator) {
      this.stopMockGeneration = this.mockEventGenerator(this.onMessage.bind(this));
    } else {
      this.socket = new WebSocket(this.url);
      this.socket.onopen = this.onOpen.bind(this);
      this.socket.onmessage = this.onMessage.bind(this);
      this.socket.onerror = this.onError.bind(this);
      this.socket.onclose = this.onClose.bind(this);
    }
  }

  disconnect() {
    if (this.networkContext.useMocks && this.stopMockGeneration) {
      this.stopMockGeneration();
    } else if (this.socket) {
      this.socket.close();
    }
  }

  onOpen(event) {
    console.log('WebSocket connection opened:', event);
  }

  onMessage(event) {
    console.log('WebSocket message received:', event.data);
    // Handle the incoming message
  }

  onError(event) {
    console.error('WebSocket encountered an error:', event);
  }

  onClose(event) {
    console.log('WebSocket connection closed:', event);
  }
}
