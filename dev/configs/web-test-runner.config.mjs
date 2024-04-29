import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
  nodeResolve: true,
  rootDir: '../src/',
  files: ['../src/components/**/*.test.*'],
  concurrentBrowsers: 1,
  concurrency: 2,
  browsers: [
    playwrightLauncher({ product: 'firefox' }),
  ]
};