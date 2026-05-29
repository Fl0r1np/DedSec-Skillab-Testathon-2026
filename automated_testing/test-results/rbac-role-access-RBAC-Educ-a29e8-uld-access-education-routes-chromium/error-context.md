# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: rbac\role-access.spec.js >> RBAC: Education Role >> should access /education routes
- Location: end-to-end-tests\rbac\role-access.spec.js:153:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.sidebar')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.sidebar')

```

```yaml
- navigation:
  - text: SKILLAB
  - list:
    - listitem:
      - link "Home":
        - /url: /
    - listitem:
      - link "Login":
        - /url: /login
- text: Login
- img
- textbox "Email"
- img
- textbox "Password"
- button "Login"
- button "Register"
```

# Test source

```ts
  58  | 
  59  |     expect(page.url()).toContain('/citizen/supply-forecasting');
  60  |   });
  61  | 
  62  |   test('should access /citizen/Configuration', async ({ page }) => {
  63  |     await page.goto('/citizen/Configuration');
  64  |     await page.waitForLoadState('domcontentloaded');
  65  | 
  66  |     expect(page.url()).toContain('/citizen/Configuration');
  67  |   });
  68  | 
  69  |   test('should NOT access /industry routes (unauthorized)', async ({ page }) => {
  70  |     await page.goto('/industry/account');
  71  |     await page.waitForLoadState('domcontentloaded');
  72  |     await page.waitForTimeout(2000);
  73  | 
  74  |     // Should be redirected away, get an error, or see unauthorized content
  75  |     const currentUrl = page.url();
  76  |     const isUnauthorized =
  77  |       !currentUrl.includes('/industry/account') ||
  78  |       (await page.locator('text=unauthorized').count()) > 0 ||
  79  |       (await page.locator('text=Unauthorized').count()) > 0 ||
  80  |       (await page.locator('text=not authorized').count()) > 0 ||
  81  |       currentUrl.includes('/login') ||
  82  |       currentUrl.includes('/citizen');
  83  | 
  84  |     expect(isUnauthorized).toBeTruthy();
  85  |   });
  86  | 
  87  |   test('should NOT access /admin routes (unauthorized)', async ({ page }) => {
  88  |     await page.goto('/admin');
  89  |     await page.waitForLoadState('domcontentloaded');
  90  |     await page.waitForTimeout(2000);
  91  | 
  92  |     const currentUrl = page.url();
  93  |     const isUnauthorized =
  94  |       !currentUrl.includes('/admin') ||
  95  |       (await page.locator('text=unauthorized').count()) > 0 ||
  96  |       (await page.locator('text=Unauthorized').count()) > 0 ||
  97  |       currentUrl.includes('/login') ||
  98  |       currentUrl.includes('/citizen');
  99  | 
  100 |     expect(isUnauthorized).toBeTruthy();
  101 |   });
  102 | });
  103 | 
  104 | // ─── Industry Role ───────────────────────────────────────────────────
  105 | test.describe('RBAC: Industry Role', () => {
  106 |   test.use({ storageState: authFile('industry') });
  107 | 
  108 |   test('should access /industry routes', async ({ page }) => {
  109 |     await page.goto('/industry/account');
  110 |     await page.waitForLoadState('domcontentloaded');
  111 | 
  112 |     // Should stay on industry area and see the dashboard
  113 |     expect(page.url()).toContain('/industry');
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
> 158 |     await expect(page.locator('.sidebar')).toBeVisible();
      |                                            ^ Error: expect(locator).toBeVisible() failed
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
  214 |     expect(page.url()).toContain('/admin');
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