// @ts-check
import { defineConfig, devices } from '@playwright/test';
import { authFile } from './auth.config.js';

/**
 * SKILLAB E2E Test Configuration
 *
 * Project structure:
 *   - "setup"    -> runs global-setup.js (authenticates all 5 roles, saves storageState)
 *   - "chromium" -> runs all E2E tests using Chromium with pre-authenticated sessions
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './end-to-end-tests',

  /* Run tests in files in parallel */
  fullyParallel: false,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Single worker to reduce load on the local Docker server */
  workers: 1,

  /* Reporter to use */
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  /* Global setup - authenticates all users before any test runs */
  globalSetup: './global-setup.js',

  /* Shared settings for all projects */
  use: {
    /* Base URL for the SKILLAB app */
    baseURL: 'http://localhost:3000',

    /* CRITICAL: Force trace and video on every failure, regardless of retries */
    trace: 'retain-on-failure',
    video: 'retain-on-failure',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',

    /* Reasonable timeouts */
    actionTimeout: 30000,
    navigationTimeout: 60000,
  },

  /* Global test timeout */
  timeout: 120000,

  /* Configure projects */
  projects: [
    // ==== Auth Setup (runs first) =======================
    {
      name: 'setup',
      testMatch: /.*\.setup\.js/,
    },

    // ===== Chromium (main browser) =========================
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Force a desktop viewport so the sidebar isn't hidden by mobile CSS
        viewport: { width: 1920, height: 1080 },
        // Default storage state for tests that don't specify their own.
        // Individual specs override this per-role via test.use({ storageState }).
        storageState: authFile('citizen'),
      },
      dependencies: ['setup'],
    },

    // ========= Uncomment to add more browsers ====
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'], storageState: authFile('citizen') },
    //   dependencies: ['setup'],
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'], storageState: authFile('citizen') },
    //   dependencies: ['setup'],
    // },
  ],
});
