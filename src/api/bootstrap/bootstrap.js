import ApiClient from '/api/client.js';
import { store } from '/state/store.js'
import { mock } from './bootstrap.mocks.js'

const client = new ApiClient('http://localhost:3000', store.networkContext)

export async function getBootstrap() {
  return client.get('/bootstrap', { mock });
}