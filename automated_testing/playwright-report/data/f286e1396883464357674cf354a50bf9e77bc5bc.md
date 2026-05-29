# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: rbac\role-access.spec.js >> RBAC: Admin Role >> should access /admin routes
- Location: end-to-end-tests\rbac\role-access.spec.js:209:3

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "/admin"
Received string:    "http://localhost:3000/"
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
  114 |     await expect(page.locator('.sidebar')).toBeVisible();
  115 |   });
  116 | 
  117 |   test('should NOT access /citizen routes (unauthorized)', async ({ page }) => {
  118 |     await page.goto('/citizen/account');
  119 |     await page.waitForLoadState('domcontentloaded');
  120 |     await page.waitForTimeout(2000);
  121 | 
  122 |     const currentUrl = page.url();
  123 |     const isUnauthorized =
  124 |       !currentUrl.includes('/citizen/account') ||
  125 |       (await page.locator('text=unauthorized').count()) > 0 ||
  126 |       (await page.locator('text=Unauthorized').count()) > 0 ||
  127 |       currentUrl.includes('/login') ||
  128 |       currentUrl.includes('/industry');
  129 | 
  130 |     expect(isUnauthorized).toBeTruthy();
  131 |   });
  132 | 
  133 |   test('should NOT access /admin routes (unauthorized)', async ({ page }) => {
  134 |     await page.goto('/admin');
  135 |     await page.waitForLoadState('domcontentloaded');
  136 |     await page.waitForTimeout(2000);
  137 | 
  138 |     const currentUrl = page.url();
  139 |     const isUnauthorized =
  140 |       !currentUrl.includes('/admin') ||
  141 |       (await page.locator('text=unauthorized').count()) > 0 ||
  142 |       currentUrl.includes('/login') ||
  143 |       currentUrl.includes('/industry');
  144 | 
  145 |     expect(isUnauthorized).toBeTruthy();
  146 |   });
  147 | });
  148 | 
  149 | // ─── Education Role ──────────────────────────────────────────────────
  150 | test.describe('RBAC: Education Role', () => {
  151 |   test.use({ storageState: authFile('education') });
  152 | 
  153 |   test('should access /education routes', async ({ page }) => {
  154 |     await page.goto('/education/account');
  155 |     await page.waitForLoadState('domcontentloaded');
  156 | 
  157 |     expect(page.url()).toContain('/education');
  158 |     await expect(page.locator('.sidebar')).toBeVisible();
  159 |   });
  160 | 
  161 |   test('should NOT access /admin routes (unauthorized)', async ({ page }) => {
  162 |     await page.goto('/admin');
  163 |     await page.waitForLoadState('domcontentloaded');
  164 |     await page.waitForTimeout(2000);
  165 | 
  166 |     const currentUrl = page.url();
  167 |     const isUnauthorized =
  168 |       !currentUrl.includes('/admin') ||
  169 |       (await page.locator('text=unauthorized').count()) > 0 ||
  170 |       currentUrl.includes('/login') ||
  171 |       currentUrl.includes('/education');
  172 | 
  173 |     expect(isUnauthorized).toBeTruthy();
  174 |   });
  175 | });
  176 | 
  177 | // ─── Policy Role ─────────────────────────────────────────────────────
  178 | test.describe('RBAC: Policy Role', () => {
  179 |   test.use({ storageState: authFile('policy') });
  180 | 
  181 |   test('should access /policy routes', async ({ page }) => {
  182 |     await page.goto('/policy/account');
  183 |     await page.waitForLoadState('domcontentloaded');
  184 | 
  185 |     expect(page.url()).toContain('/policy');
  186 |     await expect(page.locator('.sidebar')).toBeVisible();
  187 |   });
  188 | 
  189 |   test('should NOT access /citizen routes (unauthorized)', async ({ page }) => {
  190 |     await page.goto('/citizen/account');
  191 |     await page.waitForLoadState('domcontentloaded');
  192 |     await page.waitForTimeout(2000);
  193 | 
  194 |     const currentUrl = page.url();
  195 |     const isUnauthorized =
  196 |       !currentUrl.includes('/citizen/account') ||
  197 |       (await page.locator('text=unauthorized').count()) > 0 ||
  198 |       currentUrl.includes('/login') ||
  199 |       currentUrl.includes('/policy');
  200 | 
  201 |     expect(isUnauthorized).toBeTruthy();
  202 |   });
  203 | });
  204 | 
  205 | // ─── Admin Role ──────────────────────────────────────────────────────
  206 | test.describe('RBAC: Admin Role', () => {
  207 |   test.use({ storageState: authFile('admin') });
  208 | 
  209 |   test('should access /admin routes', async ({ page }) => {
  210 |     await page.goto('/admin');
  211 |     await page.waitForLoadState('domcontentloaded');
  212 | 
  213 |     // Admin should stay on admin area
> 214 |     expect(page.url()).toContain('/admin');
      |                        ^ Error: expect(received).toContain(expected) // indexOf
  215 |   });
  216 | 
  217 |   test('admin may have elevated access to other role routes', async ({ page }) => {
  218 |     // This test documents admin's cross-role behavior
  219 |     // Admins might or might not have access to all role routes
  220 |     await page.goto('/citizen/account');
  221 |     await page.waitForLoadState('domcontentloaded');
  222 |     await page.waitForTimeout(2000);
  223 | 
  224 |     // Just document what happens — admin might get redirected or granted access
  225 |     const currentUrl = page.url();
  226 |     // If admin is redirected, note it; if granted access, that's also valid for admin
  227 |     expect(currentUrl).toBeTruthy(); // Always passes — the test is for documentation
  228 |     console.log(`[RBAC] Admin navigating to /citizen/account ended up at: ${currentUrl}`);
  229 |   });
  230 | });
  231 | 
```