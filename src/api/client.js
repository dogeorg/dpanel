import { mocks } from "./mocks.js";
import { store } from "/state/store.js";
import { ReactiveClass } from "/utils/class-reactive.js";
import { StoreSubscriber } from "/state/subscribe.js";

export default class ApiClient extends ReactiveClass {
  constructor(baseURL, networkContext = {}) {
    super();
    this.baseURL = baseURL

    this.context = new StoreSubscriber(this, store);
    this.networkContext = this.context.store.networkContext;

    if (this.networkContext && this.networkContext.overrideBaseUrl) {
      this.baseURL = this.networkContext.apiBaseUrl || 'http://nope.localhost:6969';
    }
  }

  requestUpdate() {
    super.requestUpdate();
    this.networkContext = this.context.store.networkContext;
  }

  async get(path, config = {}) {
    return this.request(path, { ...config, method: 'GET' });
  }

  async post(path, body, config = {}) {
    return this.request(path, { ...config, method: 'POST', body: JSON.stringify(body) });
  }

  async put(path, body, config = {}) {
    return this.request(path, { ...config, method: 'PUT', body: JSON.stringify(body) });
  }

  async request(path, config) {
    // Debug, if the dev has forceDelay, wait the delay time in seconds before making request
    if (this.networkContext.forceDelayInSeconds) {
      await new Promise(resolve => setTimeout(resolve, this.networkContext.forceDelayInSeconds * 1000));
    }

    // If mocks enabled, avoid making legitimate request, return mocked response (success or error) instead.
    const hasMock = !!config.mock
    const useMocks = this.networkContext.useMocks
    const specificMockEnabled = hasMock && useMocks && isMockEnabled(config.mock.group, config.mock.name, config.mock.method, this.networkContext)
    if (useMocks && hasMock && specificMockEnabled) {
      return await returnMockedResponse(path, config, this.networkContext)
    }

    // Otherwise, perform the fetch request
    const url = new URL(path, this.baseURL).href;
    const headers = { 'Content-Type': 'application/json', ...config.headers };

    if (this.networkContext.token) {
      headers.Authorization = `Bearer ${this.networkContext.token}`
    }

    let response, data

    try {
      response = await fetch(url, { ...config, headers });
    } catch (fetchErr) {
      throw new Error('An error occurred while fetching data, refer to network logs');
    }

    if (response.status === 404) {
      throw new Error(`Resource not found: ${url}`);
    }

    if (response.status === 403) {
      return { success: false, error: true, status: 403 }
    }

    if (response.status === 401) {
      return window.location.href = window.location.origin + "/logout"
    }

    if (!response.ok) {
      console.warn('Unsuccessful respose', { status: response.status })
      throw new Error('Fetching returned an unsuccessful response');
    }

    try {
      data = await response.json();
    } catch (jsonParseErr) {
      console.warn('Could not JSON parse response from server', jsonParseErr);
      throw new Error('Could not JSON parse response from server');
    }

    return data;
  }
}

async function returnMockedResponse(path, config, networkContext) {

  const { forceFailures, reqLogs } = networkContext;

  reqLogs && console.group('Mock Request', path)
  reqLogs && console.log(`Req (${config.method}):`, config.body || '--no-body');

  const response = (typeof config.mock.res === 'function')
    ? config.mock.res(path, { forceFailures })
    : getMockedSuccessOrError(path, config.mock.res, forceFailures);
    reqLogs && console.log('Res:', response);
    reqLogs && console.groupEnd();

  return response
}

function getMockedSuccessOrError(path, mock, forceFailures) {
  // When forcing failure
  if (forceFailures) {
    throw new Error(`Simulated error returned from ${path}`)
  }
  return mock;
}

function isMockEnabled(group, name, method, networkContext) {
  if (!group || !name || !method) {
    console.warn('Mock check was provided invalid group, name or method', arguments)
    return false;
  }

  return networkContext[`mock::${group}::${name}::${method}`]
}
