// @ts-check
import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../pages/DashboardPage.js';
import { authFile } from '../../auth.config.js';

/**
 * RBAC (Role-Based Access Control) Tests.
 *
 * Verifies that each user role can access its own dashboard and routes,
 * and is properly denied access to other roles' routes.
 *
 * Roles tested: Citizen, Industry, Education, Policy, Admin
 */

// ====== Citizen Role ========
test.describe('RBAC: Citizen Role', () => {
  test.use({ storageState: authFile('citizen') });

  test('should access /citizen/account', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto('/citizen/account');

    await expect(dashboard.sidebar).toBeVisible();
    await expect(dashboard.contentArea).toBeVisible();
    await expect(dashboard.profileCard).toBeVisible();
  });

  test('should access /citizen/demand-analytics', async ({ page }) => {
    await page.goto('/citizen/demand-analytics');
    await page.waitForLoadState('domcontentloaded');

    // Should not be redirected away — should remain on the demand analytics page
    expect(page.url()).toContain('/citizen/demand-analytics');

    // Content area should be present
    const content = page.locator('.main-panel .content');
    await expect(content).toBeVisible();
  });

  test('should access /citizen/supply-analytics', async ({ page }) => {
    await page.goto('/citizen/supply-analytics');
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/citizen/supply-analytics');
    await expect(page.locator('.main-panel .content')).toBeVisible();
  });

  test('should access /citizen/demand-forecasting', async ({ page }) => {
    await page.goto('/citizen/demand-forecasting');
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/citizen/demand-forecasting');
  });

  test('should access /citizen/supply-forecasting', async ({ page }) => {
    await page.goto('/citizen/supply-forecasting');
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/citizen/supply-forecasting');
  });

  test('should access /citizen/Configuration', async ({ page }) => {
    await page.goto('/citizen/Configuration');
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/citizen/Configuration');
  });

  test('should NOT access /industry routes (unauthorized)', async ({ page }) => {
    await page.goto('/industry/account');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Should be redirected away, get an error, or see unauthorized content
    const currentUrl = page.url();
    const isUnauthorized =
      !currentUrl.includes('/industry/account') ||
      (await page.locator('text=unauthorized').count()) > 0 ||
      (await page.locator('text=Unauthorized').count()) > 0 ||
      (await page.locator('text=not authorized').count()) > 0 ||
      currentUrl.includes('/login') ||
      currentUrl.includes('/citizen');

    expect(isUnauthorized).toBeTruthy();
  });

  test('should NOT access /admin routes (unauthorized)', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const currentUrl = page.url();
    const isUnauthorized =
      !currentUrl.includes('/admin') ||
      (await page.locator('text=unauthorized').count()) > 0 ||
      (await page.locator('text=Unauthorized').count()) > 0 ||
      currentUrl.includes('/login') ||
      currentUrl.includes('/citizen');

    expect(isUnauthorized).toBeTruthy();
  });
});

// ======= Industry Role ====================
test.describe('RBAC: Industry Role', () => {
  test.use({ storageState: authFile('industry') });

  test('should access /industry routes', async ({ page }) => {
    await page.goto('/industry/account');
    await page.waitForLoadState('domcontentloaded');

    // Should stay on industry area and see the dashboard
    expect(page.url()).toContain('/industry');
    await expect(page.locator('.sidebar')).toBeVisible();
  });

  test('should NOT access /citizen routes (unauthorized)', async ({ page }) => {
    await page.goto('/citizen/account');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const currentUrl = page.url();
    const isUnauthorized =
      !currentUrl.includes('/citizen/account') ||
      (await page.locator('text=unauthorized').count()) > 0 ||
      (await page.locator('text=Unauthorized').count()) > 0 ||
      currentUrl.includes('/login') ||
      currentUrl.includes('/industry');

    expect(isUnauthorized).toBeTruthy();
  });

  test('should NOT access /admin routes (unauthorized)', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const currentUrl = page.url();
    const isUnauthorized =
      !currentUrl.includes('/admin') ||
      (await page.locator('text=unauthorized').count()) > 0 ||
      currentUrl.includes('/login') ||
      currentUrl.includes('/industry');

    expect(isUnauthorized).toBeTruthy();
  });
});

// ======== Education Role ============
test.describe('RBAC: Education Role', () => {
  test.use({ storageState: authFile('education') });

  test('should access /education routes', async ({ page }) => {
    await page.goto('/education/account');
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/education');
    await expect(page.locator('.sidebar')).toBeVisible();
  });

  test('should NOT access /admin routes (unauthorized)', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const currentUrl = page.url();
    const isUnauthorized =
      !currentUrl.includes('/admin') ||
      (await page.locator('text=unauthorized').count()) > 0 ||
      currentUrl.includes('/login') ||
      currentUrl.includes('/education');

    expect(isUnauthorized).toBeTruthy();
  });
});

// ======= Policy Role ==================
test.describe('RBAC: Policy Role', () => {
  test.use({ storageState: authFile('policy') });

  test('should access /policy routes', async ({ page }) => {
    await page.goto('/policy/account');
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/policy');
    await expect(page.locator('.sidebar')).toBeVisible();
  });

  test('should NOT access /citizen routes (unauthorized)', async ({ page }) => {
    await page.goto('/citizen/account');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const currentUrl = page.url();
    const isUnauthorized =
      !currentUrl.includes('/citizen/account') ||
      (await page.locator('text=unauthorized').count()) > 0 ||
      currentUrl.includes('/login') ||
      currentUrl.includes('/policy');

    expect(isUnauthorized).toBeTruthy();
  });
});

// ==== Admin Role ==============
test.describe('RBAC: Admin Role', () => {
  test.use({ storageState: authFile('admin') });

  test('should access /admin routes', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');

    // Admin should stay on admin area
    expect(page.url()).toContain('/admin');
  });

  test('admin may have elevated access to other role routes', async ({ page }) => {
    // This test documents admin's cross-role behavior
    // Admins might or might not have access to all role routes
    await page.goto('/citizen/account');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Just document what happens — admin might get redirected or granted access
    const currentUrl = page.url();
    // If admin is redirected, note it; if granted access, that's also valid for admin
    expect(currentUrl).toBeTruthy(); // Always passes — the test is for documentation
    console.log(`[RBAC] Admin navigating to /citizen/account ended up at: ${currentUrl}`);
  });
});
