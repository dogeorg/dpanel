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
      return await returnMockedResponse(config.mock, this.networkContext)
    }

    // Otherwise, perform the fetch request
    const url = new URL(path, this.baseURL).href;
    const headers = { 'Content-Type': 'application/json', ...config.headers };
    const response = await fetch(url, { ...config, headers });
    const data = await response.json();
    if (!response.ok || !data) {
      throw new Error(data.message || 'An error occurred while fetching data');
    }
    return data;
  }
}

function returnMockedResponse(mock, networkContext) {
  const { forceDelayInSeconds, forceFailures } = networkContext;
  return new Promise((resolve) => {
    setTimeout(function() {
      const response = (typeof mock === 'function')
        ? mock(path, { forceFailures })
        : getMockedSuccessOrError(mock, forceFailures);
      resolve(response);
    }, forceDelayInSeconds * 1000 || 0);
  });
}

function getMockedSuccessOrError(mock, forceFailuresFlag) {
  if (Array.isArray(mock) && mock.length >= 2) return mock[forceFailuresFlag ? 1 : 0];
  return mock
}