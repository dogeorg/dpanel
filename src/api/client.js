export default class ApiClient {
  constructor(baseURL, networkContext) {
    this.baseURL = baseURL;
    this.networkContext = networkContext;
  }

  async get(path, config = {}) {
    return this.request(path, { ...config, method: 'GET' });
  }

  async post(path, body, config = {}) {
    return this.request(path, { ...config, method: 'POST', body: JSON.stringify(body) });
  }

  async request(path, config) {
    // If mocks enabled, avoid making legitimate request, return mocked response (success or error) instead.
    if (this.networkContext.useMocks && config.mock) {
      return await returnMockedResponse(path, config, this.networkContext)
    }

    // Otherwise, perform the fetch request
    const url = new URL(path, this.baseURL).href;
    const headers = { 'Content-Type': 'application/json', ...config.headers };

    // Debug, if the dev has forceDelay, wait the delay time in seconds before making request
    if (this.networkContext.forceDelayInSeconds) {
      await new Promise(resolve => setTimeout(resolve, this.networkContext.forceDelayInSeconds * 1000));
    }

    const response = await fetch(url, { ...config, headers });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred while fetching data');
    }
    return data;
  }
}

function returnMockedResponse(path, config, networkContext) {
  const { useMocks ,forceDelayInSeconds, forceFailures, reqLogs } = networkContext;
  reqLogs && console.group('Mock Request', path)
  reqLogs && console.log('Req:', config.method, (config.body || '--no-body'));
  return new Promise((resolve) => {
    setTimeout(function() {
      const response = (typeof config.mock === 'function')
        ? mock(path, { forceFailures })
        : getMockedSuccessOrError(config.mock, forceFailures);
        reqLogs && console.log('Res:', response);
        reqLogs && console.groupEnd();
      resolve(response);
    }, forceDelayInSeconds * 1000 || 0);
  });
}

function getMockedSuccessOrError(mock, forceFailuresFlag) {
  if (Array.isArray(mock) && mock.length >= 2) return mock[forceFailuresFlag ? 1 : 0];
  return mock
}