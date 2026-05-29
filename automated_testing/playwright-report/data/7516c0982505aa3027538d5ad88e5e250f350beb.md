# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth\citizen-login.spec.js >> Citizen Dashboard — Post-Login Verification >> should logout and return to login page
- Location: end-to-end-tests\auth\citizen-login.spec.js:229:3

# Error details

```
TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/login" until "load"
  navigated to "http://localhost:3000/"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - navigation [ref=e3]:
    - generic [ref=e4]: SKILLAB
    - list [ref=e5]:
      - listitem [ref=e6]:
        - link "Home" [ref=e7] [cursor=pointer]:
          - /url: /
      - listitem [ref=e8]:
        - link "Login" [ref=e9] [cursor=pointer]:
          - /url: /login
  - generic [ref=e10]:
    - banner [ref=e11]:
      - img "SkillLab Logo" [ref=e13]
    - main [ref=e14]:
      - paragraph [ref=e15]: The SKILLAB project aims at monitoring and mining Internet resources and EU initiatives to acquire and process meaningful new data about existing and future skills, and reskilling/upskilling needs. State-of-the-art IT technologies will be used to empower the platform and achieve its goals, including advanced visualization and advanced data analysis, machine learning, and competency mining.
    - img "Europe Map" [ref=e17]
```

# Test source

```ts
  138 |   });
  139 | 
  140 |   test('should display the navbar with "My Account" title', async ({ page }) => {
  141 |     const dashboard = new DashboardPage(page);
  142 | 
  143 |     await dashboard.goto('/citizen/account');
  144 | 
  145 |     const title = await dashboard.getNavbarTitle();
  146 |     expect(title).toContain('My Account');
  147 |   });
  148 | 
  149 |   test('should display correct sidebar navigation items', async ({ page }) => {
  150 |     const dashboard = new DashboardPage(page);
  151 | 
  152 |     await dashboard.goto('/citizen/account');
  153 | 
  154 |     const sidebarTexts = await dashboard.getSidebarLinkTexts();
  155 | 
  156 |     // Citizen should see: My Account, Demand (Analytics, Forecasting),
  157 |     // Supply (Analytics, Forecasting), Configuration
  158 |     expect(sidebarTexts.join(' ')).toContain('My Account');
  159 |     expect(sidebarTexts.join(' ')).toContain('Demand');
  160 |     expect(sidebarTexts.join(' ')).toContain('Supply');
  161 |     expect(sidebarTexts.join(' ')).toContain('Configuration');
  162 |   });
  163 | 
  164 |   test('should display My Skills card with skill input', async ({ page }) => {
  165 |     const dashboard = new DashboardPage(page);
  166 | 
  167 |     await dashboard.goto('/citizen/account');
  168 | 
  169 |     await expect(dashboard.mySkillsCard).toBeVisible();
  170 |     await expect(dashboard.skillInput).toBeVisible();
  171 |     await expect(dashboard.skillInput).toHaveAttribute('placeholder', 'Type a skill...');
  172 |   });
  173 | 
  174 |   test('should display Target Occupation card', async ({ page }) => {
  175 |     const dashboard = new DashboardPage(page);
  176 | 
  177 |     await dashboard.goto('/citizen/account');
  178 | 
  179 |     await expect(dashboard.targetOccupationCard).toBeVisible();
  180 |     await expect(dashboard.occupationInput).toBeVisible();
  181 |     await expect(dashboard.occupationInput).toHaveAttribute('placeholder', 'Type an occupation...');
  182 |   });
  183 | 
  184 |   test('should display Recommended Occupations card', async ({ page }) => {
  185 |     const dashboard = new DashboardPage(page);
  186 | 
  187 |     await dashboard.goto('/citizen/account');
  188 | 
  189 |     await expect(dashboard.recommendedOccupationsCard).toBeVisible();
  190 |   });
  191 | 
  192 |   test('should display EU funding statement in sidebar footer', async ({ page }) => {
  193 |     const dashboard = new DashboardPage(page);
  194 | 
  195 |     await dashboard.goto('/citizen/account');
  196 | 
  197 |     await expect(dashboard.fundingStatement).toBeVisible();
  198 |     const fundingText = await dashboard.fundingStatement.textContent();
  199 |     expect(fundingText).toContain('European Union');
  200 |     expect(fundingText).toContain('Horizon Europe');
  201 |   });
  202 | 
  203 |   test('should navigate to Demand Analytics via sidebar', async ({ page }) => {
  204 |     const dashboard = new DashboardPage(page);
  205 | 
  206 |     await dashboard.goto('/citizen/account');
  207 | 
  208 |     // Expand the Demand section and click Analytics
  209 |     await dashboard.expandSidebarSection('Demand');
  210 |     await dashboard.clickSidebarLink('Analytics');
  211 | 
  212 |     await page.waitForURL('**/citizen/demand-analytics', { timeout: 10000 });
  213 |     expect(page.url()).toContain('/citizen/demand-analytics');
  214 |   });
  215 | 
  216 |   test('should navigate to Supply Forecasting via sidebar', async ({ page }) => {
  217 |     const dashboard = new DashboardPage(page);
  218 | 
  219 |     await dashboard.goto('/citizen/account');
  220 | 
  221 |     // Expand the Supply section and click Forecasting
  222 |     await dashboard.expandSidebarSection('Supply');
  223 |     await dashboard.clickSidebarLink('Forecasting');
  224 | 
  225 |     await page.waitForURL('**/citizen/supply-forecasting', { timeout: 10000 });
  226 |     expect(page.url()).toContain('/citizen/supply-forecasting');
  227 |   });
  228 | 
  229 |   test('should logout and return to login page', async ({ page }) => {
  230 |     const dashboard = new DashboardPage(page);
  231 | 
  232 |     await dashboard.goto('/citizen/account');
  233 | 
  234 |     // Click logout
  235 |     await dashboard.logout();
  236 | 
  237 |     // Wait for the app to redirect to the login page
> 238 |     await page.waitForURL('**/login', { timeout: 15000 });
      |                ^ TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
  239 | 
  240 |     // Verify we landed on the login page
  241 |     expect(page.url()).toContain('/login');
  242 |   });
  243 | });
  244 | 
```