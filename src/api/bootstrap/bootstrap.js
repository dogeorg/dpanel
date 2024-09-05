import ApiClient from '/api/client.js';
import { store } from '/state/store.js'
import { mock } from './bootstrap.mocks.js'
import { mockV2 } from './bootstrap.mocks.v2.js'

const client = new ApiClient('http://localhost:3000', store.networkContext)

export async function getBootstrap() {
  return client.get('/setup/bootstrap', { mock });
}

export async function getBootstrapV2() {
  return client.get('/system/bootstrap', { mock: mockV2 })
}