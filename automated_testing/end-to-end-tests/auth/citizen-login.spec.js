// @ts-check
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import { DashboardPage } from '../../pages/DashboardPage.js';
import { USERS, authFile } from '../../auth.config.js';

/**
 * Comprehensive UI tests for the Citizen login path.
 *
 * This suite covers:
 *   1. Valid login via the UI -> redirect to dashboard
 *   2. Invalid credentials -> error feedback
 *   3. Empty field submission -> stays on login
 *   4. Post-login dashboard verification (profile, sidebar, skills)
 *   5. Sidebar navigation
 *   6. Logout flow
 */

// ==== Tests that require fresh (unauthenticated) browser ==========
test.describe('Citizen Login — Authentication Flow', () => {
  // Use a clean browser with NO stored session
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should login successfully with valid Citizen credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const citizen = USERS.citizen;

    // Navigate to login
    await loginPage.goto();

    // Verify login form is visible
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.registerButton).toBeVisible();

    // Perform login
    await loginPage.login(citizen.email, citizen.password);

    // Wait for navigation to dashboard
    await page.waitForURL('**/citizen/**', { timeout: 15000 });

    // Verify we landed on the citizen dashboard
    expect(page.url()).toContain('/citizen');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    // Attempt login with wrong password
    await loginPage.login('citizen@citizen.com', 'wrongpassword');

    // Should stay on login page or show error
    await page.waitForTimeout(2000);

    // Check: either an error message appears, or we remain on /login
    const errorMsg = await loginPage.getErrorMessage();
    const stillOnLogin = loginPage.isOnLoginPage();

    // At least one of these must be true
    expect(errorMsg !== null || stillOnLogin).toBeTruthy();

    if (errorMsg) {
      // The API returns "Invalid credentials" on 403
      expect(errorMsg.toLowerCase()).toContain('invalid');
    }
  });

  test('should not submit with empty email and password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    // Click login with empty fields
    await loginPage.loginButton.click();

    // Should remain on the login page
    await page.waitForTimeout(1000);
    expect(loginPage.isOnLoginPage()).toBeTruthy();

    // Login form should still be visible
    await expect(loginPage.form).toBeVisible();
  });

  test('should not submit with empty password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    // Fill only email, leave password empty
    await loginPage.emailInput.fill('citizen@citizen.com');
    await loginPage.loginButton.click();

    // Should remain on login page
    await page.waitForTimeout(1000);
    expect(loginPage.isOnLoginPage()).toBeTruthy();
  });

  test('should display the navigation bar with Home and Login links', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    // Verify nav links
    await expect(loginPage.navHomeLink).toBeVisible();
    await expect(loginPage.navLoginLink).toBeVisible();

    // Verify link texts
    await expect(loginPage.navHomeLink).toHaveText('Home');
    await expect(loginPage.navLoginLink).toHaveText('Login');
  });
});

// ==== Tests that use pre-authenticated Citizen session =======
test.describe('Citizen Dashboard — Post-Login Verification', () => {
  // Use the pre-authenticated citizen session from global-setup
  test.use({ storageState: authFile('citizen') });

  test('should display the citizen profile with correct user data', async ({ page }) => {
    const dashboard = new DashboardPage(page);

    await dashboard.goto('/citizen/account');

    // Verify the sidebar is visible with SKILLAB branding
    await expect(dashboard.sidebar).toBeVisible();
    const logoText = await dashboard.getLogoText();
    expect(logoText).toContain('SKILLAB');

    // Verify profile card
    await expect(dashboard.profileCard).toBeVisible();
    await expect(dashboard.profileCardTitle).toHaveText('Profile');

    // Verify user data — use web-first assertions to wait for async API data
    await expect(dashboard.profileNameInput).toHaveValue(/citizen/i, { timeout: 15000 });
    await expect(dashboard.profileEmailInput).toHaveValue('citizen@citizen.com', { timeout: 15000 });
  });

  test('should display the navbar with "My Account" title', async ({ page }) => {
    const dashboard = new DashboardPage(page);

    await dashboard.goto('/citizen/account');

    const title = await dashboard.getNavbarTitle();
    expect(title).toContain('My Account');
  });

  test('should display correct sidebar navigation items', async ({ page }) => {
    const dashboard = new DashboardPage(page);

    await dashboard.goto('/citizen/account');

    const sidebarTexts = await dashboard.getSidebarLinkTexts();

    // Citizen should see: My Account, Demand (Analytics, Forecasting),
    // Supply (Analytics, Forecasting), Configuration
    expect(sidebarTexts.join(' ')).toContain('My Account');
    expect(sidebarTexts.join(' ')).toContain('Demand');
    expect(sidebarTexts.join(' ')).toContain('Supply');
    expect(sidebarTexts.join(' ')).toContain('Configuration');
  });

  test('should display My Skills card with skill input', async ({ page }) => {
    const dashboard = new DashboardPage(page);

    await dashboard.goto('/citizen/account');

    await expect(dashboard.mySkillsCard).toBeVisible();
    await expect(dashboard.skillInput).toBeVisible();
    await expect(dashboard.skillInput).toHaveAttribute('placeholder', 'Type a skill...');
  });

  test('should display Target Occupation card', async ({ page }) => {
    const dashboard = new DashboardPage(page);

    await dashboard.goto('/citizen/account');

    await expect(dashboard.targetOccupationCard).toBeVisible();
    await expect(dashboard.occupationInput).toBeVisible();
    await expect(dashboard.occupationInput).toHaveAttribute('placeholder', 'Type an occupation...');
  });

  test('should display Recommended Occupations card', async ({ page }) => {
    const dashboard = new DashboardPage(page);

    await dashboard.goto('/citizen/account');

    await expect(dashboard.recommendedOccupationsCard).toBeVisible();
  });

  test('should display EU funding statement in sidebar footer', async ({ page }) => {
    const dashboard = new DashboardPage(page);

    await dashboard.goto('/citizen/account');

    await expect(dashboard.fundingStatement).toBeVisible();
    const fundingText = await dashboard.fundingStatement.textContent();
    expect(fundingText).toContain('European Union');
    expect(fundingText).toContain('Horizon Europe');
  });

  test('should navigate to Demand Analytics via sidebar', async ({ page }) => {
    const dashboard = new DashboardPage(page);

    await dashboard.goto('/citizen/account');

    // Expand the Demand section and click Analytics
    await dashboard.expandSidebarSection('Demand');
    await dashboard.clickSidebarLink('Analytics');

    await page.waitForURL('**/citizen/demand-analytics', { timeout: 10000 });
    expect(page.url()).toContain('/citizen/demand-analytics');
  });

  test('should navigate to Supply Forecasting via sidebar', async ({ page }) => {
    const dashboard = new DashboardPage(page);

    await dashboard.goto('/citizen/account');

    // Expand the Supply section and click Forecasting
    await dashboard.expandSidebarSection('Supply');
    await dashboard.clickSidebarLink('Forecasting');

    await page.waitForURL('**/citizen/supply-forecasting', { timeout: 10000 });
    expect(page.url()).toContain('/citizen/supply-forecasting');
  });

  test('should logout and return to login page', async ({ page }) => {
    const dashboard = new DashboardPage(page);

    await dashboard.goto('/citizen/account');

    // Click logout
    await dashboard.logout();

    // Wait for the app to redirect to the login page
    await page.waitForURL('**/login', { timeout: 15000 });

    // Verify we landed on the login page
    expect(page.url()).toContain('/login');
  });
});
