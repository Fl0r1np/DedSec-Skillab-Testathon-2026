# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth\citizen-login.spec.js >> Citizen Dashboard — Post-Login Verification >> should navigate to Supply Forecasting via sidebar
- Location: end-to-end-tests\auth\citizen-login.spec.js:216:3

# Error details

```
Error: locator.click: Element is not visible
Call log:
  - waiting for locator('.sidebar .nav a').filter({ hasText: 'Forecasting' }).first()
    - locator resolved to <a class="nav-NavLink" href="/citizen/demand-forecasting">…</a>
  - attempting click action
    - scrolling into view if needed

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - link "react-logoSKILLAB" [ref=e6] [cursor=pointer]:
      - /url: https://skillab-project.eu
      - img "react-logo" [ref=e7]
      - text: SKILLAB
    - list [ref=e9]:
      - listitem [ref=e10]:
        - link " My Account" [ref=e11] [cursor=pointer]:
          - /url: /citizen/account
          - generic [ref=e12]: 
          - paragraph [ref=e13]: My Account
      - listitem [ref=e14]:
        - link "Demand" [ref=e15] [cursor=pointer]:
          - /url: "#pablo"
          - paragraph [ref=e16]: Demand
        - text:  
      - listitem [ref=e18]:
        - link "Supply" [expanded] [active] [ref=e19] [cursor=pointer]:
          - /url: "#pablo"
          - paragraph [ref=e20]: Supply
        - list [ref=e22]:
          - listitem [ref=e23]:
            - link " Analytics" [ref=e24] [cursor=pointer]:
              - /url: /citizen/supply-analytics
              - generic [ref=e25]: 
              - paragraph [ref=e26]: Analytics
          - listitem [ref=e27]:
            - link " Forecasting" [ref=e28] [cursor=pointer]:
              - /url: /citizen/supply-forecasting
              - generic [ref=e29]: 
              - paragraph [ref=e30]: Forecasting
      - listitem [ref=e31]:
        - link " Configuration" [ref=e32] [cursor=pointer]:
          - /url: /citizen/Configuration
          - generic [ref=e33]: 
          - paragraph [ref=e34]: Configuration
    - generic [ref=e36]:
      - img "EU Flag" [ref=e37]
      - paragraph [ref=e38]: This project has received funding from the European Union’s Horizon Europe Framework Programme under grant agreement No 101132663
  - generic [ref=e39]:
    - navigation [ref=e40]:
      - generic [ref=e41]:
        - link "My Account" [ref=e43] [cursor=pointer]:
          - /url: http://localhost:3000/citizen/account
        - list [ref=e45]:
          - listitem [ref=e46]:
            - link "" [ref=e47] [cursor=pointer]:
              - /url: "#"
              - generic [ref=e48]: 
              - paragraph
          - listitem [ref=e49]:
            - link [ref=e50] [cursor=pointer]:
              - /url: /citizen/account
              - img [ref=e51]
              - paragraph
          - listitem [ref=e53]:
            - link [ref=e54] [cursor=pointer]:
              - /url: /citizen/account#logout
              - img [ref=e55]
              - paragraph
    - generic [ref=e58]:
      - generic [ref=e59]:
        - generic [ref=e61]:
          - heading "Profile" [level=5] [ref=e63]
          - generic [ref=e65]:
            - generic [ref=e68]:
              - generic [ref=e69]: Name (disabled)
              - textbox "Name" [disabled] [ref=e70]: Citizen
            - generic [ref=e73]:
              - generic [ref=e74]: Email (disabled)
              - textbox "Email" [disabled] [ref=e75]: citizen@citizen.com
            - generic [ref=e78]:
              - generic [ref=e79]: Country
              - textbox "Country" [ref=e80]: Mexico
            - generic [ref=e83]:
              - generic [ref=e84]: Address
              - textbox "Address" [ref=e85]
            - generic [ref=e88]:
              - generic [ref=e89]: Portfolio URL
              - textbox "Portfolio" [ref=e90]: hood@research.dep
            - generic [ref=e93]:
              - generic [ref=e94]: CV
              - textbox "cv.pdf" [disabled] [ref=e95]
              - button "Choose File" [ref=e96]
            - button "Update Profile" [ref=e99] [cursor=pointer]
        - generic [ref=e101]:
          - heading "My Skills" [level=5] [ref=e103]
          - generic [ref=e104]:
            - generic [ref=e109]:
              - generic [ref=e110]: Skills
              - generic [ref=e111]: Years
            - generic [ref=e116]:
              - generic [ref=e117]: Java (computer programming)
              - generic [ref=e118]:
                - text: "2"
                - button "" [ref=e119] [cursor=pointer]:
                  - generic [ref=e120]: 
                - button "" [ref=e121] [cursor=pointer]:
                  - generic [ref=e122]: 
            - generic [ref=e126]:
              - generic [ref=e127]:
                - textbox "Type a skill..." [ref=e130]
                - spinbutton [ref=e132]
              - button "Add selected skill" [ref=e135] [cursor=pointer]:
                - generic [ref=e136]: 
      - generic [ref=e140]:
        - generic [ref=e141]:
          - heading "Target occupation" [level=5] [ref=e142]
          - img [ref=e143] [cursor=pointer]
        - generic [ref=e147]:
          - textbox "Type an occupation..." [ref=e148]
          - button "Apply" [ref=e149] [cursor=pointer]
      - generic [ref=e153]:
        - generic [ref=e154]:
          - heading "Recommended Occupations" [level=5] [ref=e155]
          - img [ref=e156] [cursor=pointer]
        - button "Apply" [ref=e158] [cursor=pointer]
```

# Test source

```ts
  22  |     this.sidebarLogoText = page.locator('.sidebar .logo .simple-text');
  23  |     this.sidebarNavItems = page.locator('.sidebar .nav > li');
  24  |     this.sidebarLinks = page.locator('.sidebar .nav a');
  25  | 
  26  |     // --- Top Navbar ---
  27  |     this.navbar = page.locator('nav.navbar');
  28  |     this.navbarBrand = page.locator('.navbar-brand');
  29  |     this.navbarToggler = page.locator('button.navbar-toggler');
  30  | 
  31  |     // --- User actions (top-right) ---
  32  |     this.bellIcon = page.locator('.nc-icon.nc-bell-55');
  33  |     this.accountLink = page.locator('.navbar-nav a[href*="/account"]');
  34  |     this.logoutLink = page.locator('a[href*="#logout"]');
  35  | 
  36  |     // --- Main content area ---
  37  |     this.mainPanel = page.locator('.main-panel');
  38  |     this.contentArea = page.locator('.main-panel .content');
  39  | 
  40  |     // --- Profile card (visible on /account pages) ---
  41  |     this.profileCard = page.locator('.card-user');
  42  |     this.profileCardTitle = page.locator('.card-user .card-title');
  43  |     this.profileNameInput = page.locator('.card-user input[placeholder="Name"]');
  44  |     this.profileEmailInput = page.locator('.card-user input[placeholder="Email"]');
  45  |     this.profileCountryInput = page.locator('.card-user input[placeholder="Country"]');
  46  |     this.profileAddressInput = page.locator('.card-user input[placeholder="Address"]');
  47  |     this.profilePortfolioInput = page.locator('.card-user input[placeholder="Portfolio"]');
  48  |     this.updateProfileButton = page.locator('.card-user button', { hasText: 'Update Profile' });
  49  | 
  50  |     // --- My Skills card ---
  51  |     this.mySkillsCard = page.locator('.card', { hasText: 'My Skills' });
  52  |     this.skillInput = page.locator('#skill-input');
  53  |     this.yearsInput = page.locator('input[placeholder="Years"]');
  54  |     this.addSkillButton = page.locator('button[aria-label="Add selected skill"]');
  55  | 
  56  |     // --- Target Occupation card ---
  57  |     this.targetOccupationCard = page.locator('.card', { hasText: 'Target occupation' });
  58  |     this.occupationInput = page.locator('#occupation-input');
  59  | 
  60  |     // --- Recommended Occupations card ---
  61  |     this.recommendedOccupationsCard = page.locator('.card', { hasText: 'Recommended Occupations' });
  62  | 
  63  |     // --- EU Footer ---
  64  |     this.euFooter = page.locator('.sidebar-footer');
  65  |     this.fundingStatement = page.locator('.funding-statement');
  66  |   }
  67  | 
  68  |   /**
  69  |    * Navigate to a role-specific dashboard page.
  70  |    * @param {string} rolePath - e.g., '/citizen/account', '/industry/account'
  71  |    */
  72  |   async goto(rolePath) {
  73  |     await this.page.goto(rolePath, { waitUntil: 'domcontentloaded' });
  74  |   }
  75  | 
  76  |   /**
  77  |    * Get the navbar brand / page title text.
  78  |    * @returns {Promise<string>}
  79  |    */
  80  |   async getNavbarTitle() {
  81  |     return (await this.navbarBrand.textContent()) ?? '';
  82  |   }
  83  | 
  84  |   /**
  85  |    * Get all sidebar navigation link texts.
  86  |    * @returns {Promise<string[]>}
  87  |    */
  88  |   async getSidebarLinkTexts() {
  89  |     const links = await this.sidebarLinks.allTextContents();
  90  |     return links.map((text) => text.trim()).filter((text) => text.length > 0);
  91  |   }
  92  | 
  93  |   /**
  94  |    * Get the SKILLAB logo text from the sidebar.
  95  |    * @returns {Promise<string>}
  96  |    */
  97  |   async getLogoText() {
  98  |     return (await this.sidebarLogoText.textContent()) ?? '';
  99  |   }
  100 | 
  101 |   /**
  102 |    * Get the profile name displayed in the account page.
  103 |    * @returns {Promise<string>}
  104 |    */
  105 |   async getProfileName() {
  106 |     return await this.profileNameInput.inputValue();
  107 |   }
  108 | 
  109 |   /**
  110 |    * Get the profile email displayed in the account page.
  111 |    * @returns {Promise<string>}
  112 |    */
  113 |   async getProfileEmail() {
  114 |     return await this.profileEmailInput.inputValue();
  115 |   }
  116 | 
  117 |   /**
  118 |    * Click a sidebar navigation link by its visible text.
  119 |    * @param {string} linkText - e.g., 'My Account', 'Analytics', 'Forecasting'
  120 |    */
  121 |   async clickSidebarLink(linkText) {
> 122 |     await this.sidebarLinks.filter({ hasText: linkText }).first().click({ force: true });
      |                                                                   ^ Error: locator.click: Element is not visible
  123 |   }
  124 | 
  125 |   /**
  126 |    * Expand a collapsible sidebar section (e.g., 'Demand', 'Supply').
  127 |    * @param {string} sectionText - The visible text of the collapsible header
  128 |    */
  129 |   async expandSidebarSection(sectionText) {
  130 |     const sectionToggle = this.page.locator('.sidebar .nav a.nav-link', { hasText: sectionText });
  131 |     // Check if the collapse is already open
  132 |     const collapseDiv = sectionToggle.locator('..').locator('.collapse');
  133 |     const isExpanded = await collapseDiv.evaluate((el) => el.classList.contains('show'));
  134 |     if (!isExpanded) {
  135 |       await sectionToggle.click({ force: true });
  136 |       // Wait for collapse animation
  137 |       await this.page.waitForTimeout(500);
  138 |     }
  139 |   }
  140 | 
  141 |   /**
  142 |    * Click the logout link in the top navbar.
  143 |    */
  144 |   async logout() {
  145 |     await this.logoutLink.click({ force: true });
  146 |   }
  147 | 
  148 |   /**
  149 |    * Check if the dashboard content area is visible (i.e., user is authenticated).
  150 |    * @returns {Promise<boolean>}
  151 |    */
  152 |   async isContentVisible() {
  153 |     return await this.contentArea.isVisible();
  154 |   }
  155 | 
  156 |   /**
  157 |    * Check if the sidebar is visible.
  158 |    * @returns {Promise<boolean>}
  159 |    */
  160 |   async isSidebarVisible() {
  161 |     return await this.sidebar.isVisible();
  162 |   }
  163 | 
  164 |   /**
  165 |    * Get the count of sidebar navigation items.
  166 |    * @returns {Promise<number>}
  167 |    */
  168 |   async getSidebarItemCount() {
  169 |     return await this.sidebarNavItems.count();
  170 |   }
  171 | }
  172 | 
```