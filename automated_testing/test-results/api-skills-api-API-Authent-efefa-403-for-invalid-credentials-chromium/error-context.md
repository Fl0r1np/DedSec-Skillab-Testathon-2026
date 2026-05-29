# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\skills-api.spec.js >> API: Authentication (POST /login on port 8081) >> should return 403 for invalid credentials
- Location: end-to-end-tests\api\skills-api.spec.js:95:3

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "invalid"
Received string:    ""
```

# Test source

```ts
  6   | import path from 'path';
  7   | 
  8   | /** Remote data API base URL (Skills, Courses, Jobs, Occupations) */
  9   | const API_URL = 'https://skillab-tracker.csd.auth.gr';
  10  | 
  11  | /** Local login endpoint (Docker backend on port 8081) */
  12  | const LOGIN_URL = 'http://localhost:8081';
  13  | 
  14  | /**
  15  |  * API Integration Tests for the SKILLAB Tracker API.
  16  |  *
  17  |  * These tests use Playwright's `request` context to call API endpoints
  18  |  * directly (no browser UI). They verify authentication, data retrieval,
  19  |  * filtering, pagination, and error handling.
  20  |  *
  21  |  * Auth strategy:
  22  |  *   The real accessTokenSkillabTracker is extracted from the saved
  23  |  *   playwright/.auth/citizen.json (populated by global-setup.js via
  24  |  *   real UI login). This token is trusted by the remote API.
  25  |  *
  26  |  * Endpoints tested:
  27  |  *   - POST http://localhost:8081/login       (Auth — local Docker)
  28  |  *   - POST https://skillab-tracker.csd.auth.gr/api/skills      (Skill — remote)
  29  |  *   - POST https://skillab-tracker.csd.auth.gr/api/courses     (Course — remote)
  30  |  *   - POST https://skillab-tracker.csd.auth.gr/api/jobs        (Job — remote)
  31  |  *   - POST https://skillab-tracker.csd.auth.gr/api/occupations (Occupation — remote)
  32  |  *   - GET  https://skillab-tracker.csd.auth.gr/api/jobs/sources (Job — remote)
  33  |  */
  34  | 
  35  | /** @type {string} */
  36  | let authToken;
  37  | 
  38  | /**
  39  |  * Extract the real accessTokenSkillabTracker from a saved storageState JSON file.
  40  |  * @param {string} role - e.g. 'citizen'
  41  |  * @returns {string} The bearer token
  42  |  */
  43  | function extractTokenFromStorage(role) {
  44  |   const filePath = path.resolve(authFile(role));
  45  |   const raw = fs.readFileSync(filePath, 'utf-8');
  46  |   const storageState = JSON.parse(raw);
  47  | 
  48  |   // storageState.origins is an array of { origin, localStorage: [{ name, value }] }
  49  |   for (const origin of storageState.origins || []) {
  50  |     for (const entry of origin.localStorage || []) {
  51  |       if (entry.name === 'accessTokenSkillabTracker') {
  52  |         return entry.value;
  53  |       }
  54  |     }
  55  |   }
  56  | 
  57  |   throw new Error(
  58  |     `[skills-api] accessTokenSkillabTracker not found in ${filePath}. ` +
  59  |     `Make sure global-setup.js completed successfully.`
  60  |   );
  61  | }
  62  | 
  63  | // ─── Login API Tests ─────────────────────────────────────────────────
  64  | test.describe('API: Authentication (POST /login on port 8081)', () => {
  65  |   test('should return a bearer token for valid Citizen credentials', async ({ request }) => {
  66  |     const response = await request.post(`${LOGIN_URL}/login`, {
  67  |       form: {
  68  |         email: USERS.citizen.email,
  69  |         password: USERS.citizen.password,
  70  |       },
  71  |     });
  72  | 
  73  |     expect(response.status()).toBe(200);
  74  | 
  75  |     const body = await response.text();
  76  |     const token = body.replace(/^"|"$/g, '');
  77  | 
  78  |     // Token should be a non-empty string
  79  |     expect(token.length).toBeGreaterThan(0);
  80  |   });
  81  | 
  82  |   test('should return a bearer token for valid Admin credentials', async ({ request }) => {
  83  |     const response = await request.post(`${LOGIN_URL}/login`, {
  84  |       form: {
  85  |         email: USERS.admin.email,
  86  |         password: USERS.admin.password,
  87  |       },
  88  |     });
  89  | 
  90  |     expect(response.status()).toBe(200);
  91  |     const body = await response.text();
  92  |     expect(body.replace(/^"|"$/g, '').length).toBeGreaterThan(0);
  93  |   });
  94  | 
  95  |   test('should return 403 for invalid credentials', async ({ request }) => {
  96  |     const response = await request.post(`${LOGIN_URL}/login`, {
  97  |       form: {
  98  |         email: 'nonexistent@user.com',
  99  |         password: 'wrongpassword',
  100 |       },
  101 |     });
  102 | 
  103 |     expect(response.status()).toBe(403);
  104 | 
  105 |     const body = await response.text();
> 106 |     expect(body.toLowerCase()).toContain('invalid');
      |                                ^ Error: expect(received).toContain(expected) // indexOf
  107 |   });
  108 | 
  109 |   test('should return an error for missing fields', async ({ request }) => {
  110 |     const response = await request.post(`${LOGIN_URL}/login`, {
  111 |       form: {},
  112 |     });
  113 | 
  114 |     // Expect a client error (400 or 422) for missing required fields
  115 |     expect(response.status()).toBeGreaterThanOrEqual(400);
  116 |   });
  117 | });
  118 | 
  119 | // ─── Skills API Tests ────────────────────────────────────────────────
  120 | test.describe('API: Skills (/api/skills)', () => {
  121 |   test.beforeAll(async () => {
  122 |     // Extract the REAL token from the saved citizen session
  123 |     if (!authToken) {
  124 |       authToken = extractTokenFromStorage('citizen');
  125 |       console.log(`[skills-api] Using real accessTokenSkillabTracker (length: ${authToken.length})`);
  126 |     }
  127 |   });
  128 | 
  129 |   test('should fetch skills with default pagination', async ({ request }) => {
  130 |     const response = await request.post(`${API_URL}/api/skills`, {
  131 |       headers: {
  132 |         Accept: 'application/json',
  133 |         Authorization: `Bearer ${authToken}`,
  134 |       },
  135 |       form: {},
  136 |     });
  137 | 
  138 |     expect(response.status()).toBe(200);
  139 | 
  140 |     const data = await response.json();
  141 | 
  142 |     // Paginated response should have items array and count
  143 |     expect(data).toHaveProperty('items');
  144 |     expect(Array.isArray(data.items)).toBeTruthy();
  145 |     expect(data).toHaveProperty('count');
  146 |     expect(data.count).toBeGreaterThanOrEqual(0);
  147 |   });
  148 | 
  149 |   test('should filter skills by keyword "programming"', async ({ request }) => {
  150 |     const response = await request.post(`${API_URL}/api/skills`, {
  151 |       headers: {
  152 |         Accept: 'application/json',
  153 |         Authorization: `Bearer ${authToken}`,
  154 |       },
  155 |       form: {
  156 |         keywords: 'programming',
  157 |       },
  158 |     });
  159 | 
  160 |     expect(response.status()).toBe(200);
  161 | 
  162 |     const data = await response.json();
  163 |     expect(data).toHaveProperty('items');
  164 | 
  165 |     // If results exist, verify they contain the keyword
  166 |     if (data.items.length > 0) {
  167 |       const firstSkill = data.items[0];
  168 |       // Skills have a label or description that should match
  169 |       expect(firstSkill).toHaveProperty('label');
  170 |     }
  171 |   });
  172 | 
  173 |   test('should respect page_size parameter', async ({ request }) => {
  174 |     const pageSize = 5;
  175 | 
  176 |     const response = await request.post(`${API_URL}/api/skills?page=1&page_size=${pageSize}`, {
  177 |       headers: {
  178 |         Accept: 'application/json',
  179 |         Authorization: `Bearer ${authToken}`,
  180 |       },
  181 |       form: {},
  182 |     });
  183 | 
  184 |     expect(response.status()).toBe(200);
  185 | 
  186 |     const data = await response.json();
  187 |     expect(data.items.length).toBeLessThanOrEqual(pageSize);
  188 |   });
  189 | 
  190 |   test('should support pagination across pages', async ({ request }) => {
  191 |     // Fetch page 1
  192 |     const responsePage1 = await request.post(`${API_URL}/api/skills?page=1&page_size=2`, {
  193 |       headers: {
  194 |         Accept: 'application/json',
  195 |         Authorization: `Bearer ${authToken}`,
  196 |       },
  197 |       form: {},
  198 |     });
  199 | 
  200 |     // Fetch page 2
  201 |     const responsePage2 = await request.post(`${API_URL}/api/skills?page=2&page_size=2`, {
  202 |       headers: {
  203 |         Accept: 'application/json',
  204 |         Authorization: `Bearer ${authToken}`,
  205 |       },
  206 |       form: {},
```