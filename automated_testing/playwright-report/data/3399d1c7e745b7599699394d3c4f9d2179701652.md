# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: rbac\role-access.spec.js >> RBAC: Industry Role >> should access /industry routes
- Location: end-to-end-tests\rbac\role-access.spec.js:108:3

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "/industry"
Received string:    "http://localhost:3000/login"
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
  - generic [ref=e13]:
    - generic [ref=e15]: Login
    - generic [ref=e17]:
      - generic [ref=e18]:
        - img [ref=e19]
        - textbox "Email" [ref=e21]
      - generic [ref=e22]:
        - img [ref=e23]
        - textbox "Password" [ref=e25]
      - button "Login" [ref=e26] [cursor=pointer]
      - button "Register" [ref=e27] [cursor=pointer]
```

# Test source

```ts
  13  |  */
  14  | 
  15  | // ─── Citizen Role ────────────────────────────────────────────────────
  16  | test.describe('RBAC: Citizen Role', () => {
  17  |   test.use({ storageState: authFile('citizen') });
  18  | 
  19  |   test('should access /citizen/account', async ({ page }) => {
  20  |     const dashboard = new DashboardPage(page);
  21  |     await dashboard.goto('/citizen/account');
  22  | 
  23  |     await expect(dashboard.sidebar).toBeVisible();
  24  |     await expect(dashboard.contentArea).toBeVisible();
  25  |     await expect(dashboard.profileCard).toBeVisible();
  26  |   });
  27  | 
  28  |   test('should access /citizen/demand-analytics', async ({ page }) => {
  29  |     await page.goto('/citizen/demand-analytics');
  30  |     await page.waitForLoadState('domcontentloaded');
  31  | 
  32  |     // Should not be redirected away — should remain on the demand analytics page
  33  |     expect(page.url()).toContain('/citizen/demand-analytics');
  34  | 
  35  |     // Content area should be present
  36  |     const content = page.locator('.main-panel .content');
  37  |     await expect(content).toBeVisible();
  38  |   });
  39  | 
  40  |   test('should access /citizen/supply-analytics', async ({ page }) => {
  41  |     await page.goto('/citizen/supply-analytics');
  42  |     await page.waitForLoadState('domcontentloaded');
  43  | 
  44  |     expect(page.url()).toContain('/citizen/supply-analytics');
  45  |     await expect(page.locator('.main-panel .content')).toBeVisible();
  46  |   });
  47  | 
  48  |   test('should access /citizen/demand-forecasting', async ({ page }) => {
  49  |     await page.goto('/citizen/demand-forecasting');
  50  |     await page.waitForLoadState('domcontentloaded');
  51  | 
  52  |     expect(page.url()).toContain('/citizen/demand-forecasting');
  53  |   });
  54  | 
  55  |   test('should access /citizen/supply-forecasting', async ({ page }) => {
  56  |     await page.goto('/citizen/supply-forecasting');
  57  |     await page.waitForLoadState('domcontentloaded');
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
> 113 |     expect(page.url()).toContain('/industry');
      |                        ^ Error: expect(received).toContain(expected) // indexOf
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
```