export default class ApiClient {
  constructor(baseURL, networkContext) {
    this.baseURL = baseURL;
    this.networkContext = networkContext;
  }

  async get(path, config = {}) {
    // Check if mock is provided and useMocks is true, return the mock data
    if (this.networkContext.useMocks && config.mock) {
      return typeof config.mock === 'function' ? config.mock(path) : config.mock;
    }
    // Otherwise, proceed with the original get request
    return this.request(path, { ...config, method: 'GET' });
  }

  async post(path, body, config = {}) {
    // Check if mock is provided and useMocks is true, return the mock data
    if (this.networkContext.useMocks && config.mock) {
      return typeof config.mock === 'function' ? config.mock() : config.mock;
    }
    // Otherwise, proceed with the original post request
    return this.request(path, { ...config, method: 'POST', body: JSON.stringify(body) });
  }

  async request(path, config) {
    // If useMocks is true and mock data is provided, return it immediately
    if (this.networkContext.useMocks && config.mock) {
      return typeof config.mock === 'function' ? config.mock() : config.mock;
    }

    // Otherwise, perform the fetch request
    const url = new URL(path, this.baseURL).href;
    const headers = { 'Content-Type': 'application/json', ...config.headers };
    const response = await fetch(url, { ...config, headers });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred while fetching data');
    }
    return data;
  }
}