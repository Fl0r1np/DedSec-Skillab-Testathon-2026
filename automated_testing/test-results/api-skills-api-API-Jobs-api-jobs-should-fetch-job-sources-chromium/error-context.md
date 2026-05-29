# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\skills-api.spec.js >> API: Jobs (/api/jobs) >> should fetch job sources
- Location: end-to-end-tests\api\skills-api.spec.js:351:3

# Error details

```
TimeoutError: apiRequestContext.get: Timeout 30000ms exceeded.
Call log:
  - → GET https://skillab-tracker.csd.auth.gr/api/jobs/sources
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.96 Safari/537.36
    - accept: application/json
    - accept-encoding: gzip,deflate,br
    - Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJleHAiOjE3ODAwODE4OTN9.awLdYNBni0LpoJ7vyzd3P5zj-5ZbYULJjz5QcLY0k78

```

# Test source

```ts
  252 |         Authorization: `Bearer ${authToken}`,
  253 |       },
  254 |       form: {},
  255 |     });
  256 | 
  257 |     expect(response.status()).toBe(200);
  258 | 
  259 |     const data = await response.json();
  260 |     expect(data).toHaveProperty('items');
  261 |     expect(Array.isArray(data.items)).toBeTruthy();
  262 |     expect(data).toHaveProperty('count');
  263 |   });
  264 | 
  265 |   test('should filter courses by source "udemy"', async ({ request }) => {
  266 |     const response = await request.post(`${API_URL}/api/courses`, {
  267 |       headers: {
  268 |         Accept: 'application/json',
  269 |         Authorization: `Bearer ${authToken}`,
  270 |       },
  271 |       form: {
  272 |         sources: 'udemy',
  273 |       },
  274 |     });
  275 | 
  276 |     expect(response.status()).toBe(200);
  277 | 
  278 |     const data = await response.json();
  279 |     expect(data).toHaveProperty('items');
  280 | 
  281 |     // If results exist, verify the source
  282 |     if (data.items.length > 0) {
  283 |       for (const course of data.items) {
  284 |         if (course.source) {
  285 |           expect(course.source.toLowerCase()).toBe('udemy');
  286 |         }
  287 |       }
  288 |     }
  289 |   });
  290 | 
  291 |   test('should filter courses by skill keyword', async ({ request }) => {
  292 |     const response = await request.post(`${API_URL}/api/courses`, {
  293 |       headers: {
  294 |         Accept: 'application/json',
  295 |         Authorization: `Bearer ${authToken}`,
  296 |       },
  297 |       form: {
  298 |         keywords: 'python',
  299 |       },
  300 |     });
  301 | 
  302 |     expect(response.status()).toBe(200);
  303 | 
  304 |     const data = await response.json();
  305 |     expect(data).toHaveProperty('items');
  306 |   });
  307 | });
  308 | 
  309 | // ─── Jobs API Tests ──────────────────────────────────────────────────
  310 | test.describe('API: Jobs (/api/jobs)', () => {
  311 |   test.beforeAll(async () => {
  312 |     if (!authToken) {
  313 |       authToken = extractTokenFromStorage('citizen');
  314 |     }
  315 |   });
  316 | 
  317 |   test('should fetch jobs with default parameters', async ({ request }) => {
  318 |     const response = await request.post(`${API_URL}/api/jobs`, {
  319 |       headers: {
  320 |         Accept: 'application/json',
  321 |         Authorization: `Bearer ${authToken}`,
  322 |       },
  323 |       form: {},
  324 |     });
  325 | 
  326 |     expect(response.status()).toBe(200);
  327 | 
  328 |     const data = await response.json();
  329 |     expect(data).toHaveProperty('items');
  330 |     expect(Array.isArray(data.items)).toBeTruthy();
  331 |     expect(data).toHaveProperty('count');
  332 |   });
  333 | 
  334 |   test('should filter jobs by keyword search', async ({ request }) => {
  335 |     const response = await request.post(`${API_URL}/api/jobs`, {
  336 |       headers: {
  337 |         Accept: 'application/json',
  338 |         Authorization: `Bearer ${authToken}`,
  339 |       },
  340 |       form: {
  341 |         keywords: 'developer',
  342 |       },
  343 |     });
  344 | 
  345 |     expect(response.status()).toBe(200);
  346 | 
  347 |     const data = await response.json();
  348 |     expect(data).toHaveProperty('items');
  349 |   });
  350 | 
  351 |   test('should fetch job sources', async ({ request }) => {
> 352 |     const response = await request.get(`${API_URL}/api/jobs/sources`, {
      |                                    ^ TimeoutError: apiRequestContext.get: Timeout 30000ms exceeded.
  353 |       headers: {
  354 |         Accept: 'application/json',
  355 |         Authorization: `Bearer ${authToken}`,
  356 |       },
  357 |     });
  358 | 
  359 |     expect(response.status()).toBe(200);
  360 | 
  361 |     const sources = await response.json();
  362 |     expect(Array.isArray(sources)).toBeTruthy();
  363 |   });
  364 | });
  365 | 
  366 | // ─── Occupations API Tests ───────────────────────────────────────────
  367 | test.describe('API: Occupations (/api/occupations)', () => {
  368 |   test.beforeAll(async () => {
  369 |     if (!authToken) {
  370 |       authToken = extractTokenFromStorage('citizen');
  371 |     }
  372 |   });
  373 | 
  374 |   test('should fetch occupations', async ({ request }) => {
  375 |     const response = await request.post(`${API_URL}/api/occupations`, {
  376 |       headers: {
  377 |         Accept: 'application/json',
  378 |         Authorization: `Bearer ${authToken}`,
  379 |       },
  380 |       form: {},
  381 |     });
  382 | 
  383 |     expect(response.status()).toBe(200);
  384 | 
  385 |     const data = await response.json();
  386 |     expect(data).toHaveProperty('items');
  387 |     expect(Array.isArray(data.items)).toBeTruthy();
  388 |   });
  389 | 
  390 |   test('should filter occupations by keyword', async ({ request }) => {
  391 |     const response = await request.post(`${API_URL}/api/occupations`, {
  392 |       headers: {
  393 |         Accept: 'application/json',
  394 |         Authorization: `Bearer ${authToken}`,
  395 |       },
  396 |       form: {
  397 |         keywords: 'programming',
  398 |       },
  399 |     });
  400 | 
  401 |     expect(response.status()).toBe(200);
  402 | 
  403 |     const data = await response.json();
  404 |     expect(data).toHaveProperty('items');
  405 |   });
  406 | });
  407 | 
```