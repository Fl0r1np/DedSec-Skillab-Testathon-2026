// @ts-check

/**
 * Page Object Model for the SKILLAB Dashboard page.
 * This represents the authenticated user's main panel, with the sidebar
 * navigation and content area.
 *
 * Selectors derived from the actual HTML in info/citizen_account_endpoint.txt.
 * The structure is shared across roles (citizen, industry, education, policy, admin)
 * with role-specific sidebar nav items and routes.
 */
export class DashboardPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // --- Sidebar ---
    this.sidebar = page.locator('.sidebar');
    this.sidebarLogo = page.locator('.sidebar .logo');
    this.sidebarLogoText = page.locator('.sidebar .logo .simple-text');
    this.sidebarNavItems = page.locator('.sidebar .nav > li');
    this.sidebarLinks = page.locator('.sidebar .nav a');

    // --- Top Navbar ---
    this.navbar = page.locator('nav.navbar');
    this.navbarBrand = page.locator('.navbar-brand');
    this.navbarToggler = page.locator('button.navbar-toggler');

    // --- User actions (top-right) ---
    this.bellIcon = page.locator('.nc-icon.nc-bell-55');
    this.accountLink = page.locator('.navbar-nav a[href*="/account"]');
    this.logoutLink = page.locator('a[href*="#logout"]');

    // --- Main content area ---
    this.mainPanel = page.locator('.main-panel');
    this.contentArea = page.locator('.main-panel .content');

    // --- Profile card (visible on /account pages) ---
    this.profileCard = page.locator('.card-user');
    this.profileCardTitle = page.locator('.card-user .card-title');
    this.profileNameInput = page.locator('.card-user input[placeholder="Name"]');
    this.profileEmailInput = page.locator('.card-user input[placeholder="Email"]');
    this.profileCountryInput = page.locator('.card-user input[placeholder="Country"]');
    this.profileAddressInput = page.locator('.card-user input[placeholder="Address"]');
    this.profilePortfolioInput = page.locator('.card-user input[placeholder="Portfolio"]');
    this.updateProfileButton = page.locator('.card-user button', { hasText: 'Update Profile' });

    // --- My Skills card ---
    this.mySkillsCard = page.locator('.card', { hasText: 'My Skills' });
    this.skillInput = page.locator('#skill-input');
    this.yearsInput = page.locator('input[placeholder="Years"]');
    this.addSkillButton = page.locator('button[aria-label="Add selected skill"]');

    // --- Target Occupation card ---
    this.targetOccupationCard = page.locator('.card', { hasText: 'Target occupation' });
    this.occupationInput = page.locator('#occupation-input');

    // --- Recommended Occupations card ---
    this.recommendedOccupationsCard = page.locator('.card', { hasText: 'Recommended Occupations' });

    // --- EU Footer ---
    this.euFooter = page.locator('.sidebar-footer');
    this.fundingStatement = page.locator('.funding-statement');
  }

  /**
   * Navigate to a role-specific dashboard page.
   * @param {string} rolePath - e.g., '/citizen/account', '/industry/account'
   */
  async goto(rolePath) {
    await this.page.goto(rolePath, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Get the navbar brand / page title text.
   * @returns {Promise<string>}
   */
  async getNavbarTitle() {
    return (await this.navbarBrand.textContent()) ?? '';
  }

  /**
   * Get all sidebar navigation link texts.
   * @returns {Promise<string[]>}
   */
  async getSidebarLinkTexts() {
    const links = await this.sidebarLinks.allTextContents();
    return links.map((text) => text.trim()).filter((text) => text.length > 0);
  }

  /**
   * Get the SKILLAB logo text from the sidebar.
   * @returns {Promise<string>}
   */
  async getLogoText() {
    return (await this.sidebarLogoText.textContent()) ?? '';
  }

  /**
   * Get the profile name displayed in the account page.
   * @returns {Promise<string>}
   */
  async getProfileName() {
    return await this.profileNameInput.inputValue();
  }

  /**
   * Get the profile email displayed in the account page.
   * @returns {Promise<string>}
   */
  async getProfileEmail() {
    return await this.profileEmailInput.inputValue();
  }

  /**
   * Click a sidebar navigation link by its visible text.
   * @param {string} linkText - e.g., 'My Account', 'Analytics', 'Forecasting'
   */
  async clickSidebarLink(linkText) {
    await this.sidebarLinks.filter({ hasText: linkText }).first().click({ force: true });
  }

  /**
   * Expand a collapsible sidebar section (e.g., 'Demand', 'Supply').
   * @param {string} sectionText - The visible text of the collapsible header
   */
  async expandSidebarSection(sectionText) {
    const sectionToggle = this.page.locator('.sidebar .nav a.nav-link', { hasText: sectionText });
    // Check if the collapse is already open
    const collapseDiv = sectionToggle.locator('..').locator('.collapse');
    const isExpanded = await collapseDiv.evaluate((el) => el.classList.contains('show'));
    if (!isExpanded) {
      await sectionToggle.click({ force: true });
      // Wait for collapse animation
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Click the logout link in the top navbar.
   */
  async logout() {
    await this.logoutLink.click({ force: true });
  }

  /**
   * Check if the dashboard content area is visible (i.e., user is authenticated).
   * @returns {Promise<boolean>}
   */
  async isContentVisible() {
    return await this.contentArea.isVisible();
  }

  /**
   * Check if the sidebar is visible.
   * @returns {Promise<boolean>}
   */
  async isSidebarVisible() {
    return await this.sidebar.isVisible();
  }

  /**
   * Get the count of sidebar navigation items.
   * @returns {Promise<number>}
   */
  async getSidebarItemCount() {
    return await this.sidebarNavItems.count();
  }
}
