import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'wmnjof',
  video: false,
  viewportWidth: 1200,
  viewportHeight: 1020,
  fixturesFolder: 'test/cypress/fixtures',
  screenshotsFolder: 'test/cypress/screenshots',
  videosFolder: 'test/cypress/videos',
  defaultCommandTimeout: 5000,
  pageLoadTimeout: 90000,
  numTestsKeptInMemory: 5,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  e2e: {
    baseUrl: 'http://localhost:8080/#',
    experimentalRunAllSpecs: true,
    supportFile: 'test/cypress/support/index.ts',
    specPattern: 'test/cypress/e2e/**/*.cy.{js,ts}',
    excludeSpecPattern: process.env.CI ? ['**/node_modules/**', '**/000-*.cy.{js,ts}'] : ['**/node_modules/**'],
    testIsolation: false,
  },
});
