// @ts-check
import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { USERS, BASE_URL, AUTH_DIR, authFile } from './auth.config.js';

/**
 * Global setup – authenticates all 5 SKILLAB user roles via REAL UI login
 * and persists their browser session state so individual test files can
 * skip the login UI.
 *
 * Flow per user:
 *   1. Navigate to /login
 *   2. Fill in email + password and click the Login button
 *   3. Wait for the React app to redirect to the role's dashboard
 *   4. The app naturally populates localStorage with real tokens
 *      (accessTokenSkillab, accessTokenSkillabTracker, refreshTokenSkillab)
 *   5. Save storageState to playwright/.auth/{role}.json
 */
async function globalSetup() {
  // Ensure the auth directory exists
  const authDir = path.resolve(AUTH_DIR);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const browser = await chromium.launch();

  for (const [role, credentials] of Object.entries(USERS)) {
    console.log(`[global-setup] Authenticating "${role}" (${credentials.email})...`);

    try {
      const context = await browser.newContext({
        baseURL: BASE_URL,
        viewport: { width: 1920, height: 1080 },
      });
      const page = await context.newPage();

      // --- Step 1: Navigate to the login page ---
      await page.goto('/login', { waitUntil: 'domcontentloaded' });

      // --- Step 2: Fill in credentials and submit via the UI ---
      await page.locator('input[type="email"][placeholder="Email"]').fill(credentials.email);
      await page.locator('input[type="password"][placeholder="Password"]').fill(credentials.password);
      await page.locator('button[type="submit"].btn-success').click();

      // --- Step 3: Wait for the React app to redirect to the dashboard ---
      // Each role redirects to a different path after login
      const dashboardPattern = `**${credentials.dashboardPath}**`;
      await page.waitForURL(dashboardPattern, { timeout: 30000 });

      console.log(`[global-setup] Redirected to dashboard for "${role}" → ${page.url()}`);

      // Wait for the app to fully hydrate and populate localStorage with real tokens
      await page.waitForTimeout(3000);

      // Verify the real token was set by the React app
      const token = await page.evaluate(() => localStorage.getItem('accessTokenSkillabTracker'));
      if (token) {
        console.log(`[global-setup] ✔ Real accessTokenSkillabTracker found for "${role}" (length: ${token.length})`);
      } else {
        console.warn(`[global-setup] ⚠ accessTokenSkillabTracker NOT found for "${role}" — session may be incomplete`);
      }

      // --- Step 4: Save session state (cookies + localStorage) ---
      const storagePath = path.resolve(authFile(role));
      await context.storageState({ path: storagePath });

      console.log(`[global-setup] ✔ Saved session for "${role}" → ${storagePath}`);

      await context.close();
    } catch (error) {
      console.error(`[global-setup] ✘ Error authenticating "${role}":`, error.message);
    }
  }

  await browser.close();
}

export default globalSetup;
