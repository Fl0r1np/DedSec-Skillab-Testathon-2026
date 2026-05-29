// @ts-check

/**
 * Page Object Model for the SKILLAB Login page.
 * URL: /login
 *
 * Selectors are derived from the actual HTML structure captured in
 * info/landing_page.txt — inputs have no id/name attributes, so we
 * rely on type + placeholder.
 */
export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // --- Locators ---
    this.emailInput = page.locator('input[type="email"][placeholder="Email"]');
    this.passwordInput = page.locator('input[type="password"][placeholder="Password"]');
    this.loginButton = page.locator('button[type="submit"].btn-success');
    this.registerButton = page.locator('button[type="button"].btn-primary');

    // Navigation bar
    this.navHomeLink = page.locator('a.nav-link-home[href="/"]');
    this.navLoginLink = page.locator('a.nav-link-home[href="/login"]');

    // Login form container
    this.cardBody = page.locator('.card-body');
    this.form = page.locator('.card-body form');
  }

  /**
   * Navigate to the login page.
   */
  async goto() {
    await this.page.goto('/login', { waitUntil: 'domcontentloaded' });
  }

  /**
   * Fill in credentials and submit the login form.
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Check if the login form is visible on the page.
   * @returns {Promise<boolean>}
   */
  async isLoginFormVisible() {
    return await this.form.isVisible();
  }

  /**
   * Get the current value of the email input.
   * @returns {Promise<string>}
   */
  async getEmailValue() {
    return await this.emailInput.inputValue();
  }

  /**
   * Get the current value of the password input.
   * @returns {Promise<string>}
   */
  async getPasswordValue() {
    return await this.passwordInput.inputValue();
  }

  /**
   * Check if an error message or alert is displayed after a failed login.
   * Returns the visible error text, or null if none found.
   * @returns {Promise<string|null>}
   */
  async getErrorMessage() {
    // Common patterns: alert div, toast, or inline error text
    const alertLocator = this.page.locator('.alert, .error, .toast-body, [role="alert"]').first();
    try {
      await alertLocator.waitFor({ state: 'visible', timeout: 5000 });
      return await alertLocator.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Check whether we are still on the login page (URL contains /login).
   * @returns {boolean}
   */
  isOnLoginPage() {
    return this.page.url().includes('/login');
  }
}
