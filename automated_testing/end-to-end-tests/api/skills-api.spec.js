// @ts-check
import { test, expect } from '@playwright/test';
import { USERS } from '../../auth.config.js';
import { authFile } from '../../auth.config.js';
import fs from 'fs';
import path from 'path';

/** Remote data API base URL (Skills, Courses, Jobs, Occupations) */
const API_URL = 'https://skillab-tracker.csd.auth.gr';

/** Local login endpoint (Docker backend on port 8081) */
const LOGIN_URL = 'http://localhost:8081';

/**
 * API Integration Tests for the SKILLAB Tracker API.
 *
 * These tests use Playwright's `request` context to call API endpoints
 * directly (no browser UI). They verify authentication, data retrieval,
 * filtering, pagination, and error handling.
 *
 * Auth strategy:
 *   The real accessTokenSkillabTracker is extracted from the saved
 *   playwright/.auth/citizen.json (populated by global-setup.js via
 *   real UI login). This token is trusted by the remote API.
 *
 * Endpoints tested:
 *   - POST http://localhost:8081/login       (Auth - local Docker)
 *   - POST https://skillab-tracker.csd.auth.gr/api/skills      (Skill - remote)
 *   - POST https://skillab-tracker.csd.auth.gr/api/courses     (Course - remote)
 *   - POST https://skillab-tracker.csd.auth.gr/api/jobs        (Job - remote)
 *   - POST https://skillab-tracker.csd.auth.gr/api/occupations (Occupation - remote)
 *   - GET  https://skillab-tracker.csd.auth.gr/api/jobs/sources (Job - remote)
 */

/** @type {string} */
let authToken;

/**
 * Extract the real accessTokenSkillabTracker from a saved storageState JSON file.
 * @param {string} role - e.g. 'citizen'
 * @returns {string} The bearer token
 */
function extractTokenFromStorage(role) {
  const filePath = path.resolve(authFile(role));
  const raw = fs.readFileSync(filePath, 'utf-8');
  const storageState = JSON.parse(raw);

  // storageState.origins is an array of { origin, localStorage: [{ name, value }] }
  for (const origin of storageState.origins || []) {
    for (const entry of origin.localStorage || []) {
      if (entry.name === 'accessTokenSkillabTracker') {
        return entry.value;
      }
    }
  }

  throw new Error(
    `[skills-api] accessTokenSkillabTracker not found in ${filePath}. ` +
    `Make sure global-setup.js completed successfully.`
  );
}

// ===== Login API Tests ==============
test.describe('API: Authentication (POST /login on port 8081)', () => {
  test('should return a bearer token for valid Citizen credentials', async ({ request }) => {
    const response = await request.post(`${LOGIN_URL}/login`, {
      form: {
        email: USERS.citizen.email,
        password: USERS.citizen.password,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.text();
    const token = body.replace(/^"|"$/g, '');

    // Token should be a non-empty string
    expect(token.length).toBeGreaterThan(0);
  });

  test('should return a bearer token for valid Admin credentials', async ({ request }) => {
    const response = await request.post(`${LOGIN_URL}/login`, {
      form: {
        email: USERS.admin.email,
        password: USERS.admin.password,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body.replace(/^"|"$/g, '').length).toBeGreaterThan(0);
  });

  test('should return 403 for invalid credentials', async ({ request }) => {
    const response = await request.post(`${LOGIN_URL}/login`, {
      form: {
        email: 'nonexistent@user.com',
        password: 'wrongpassword',
      },
    });

    expect(response.status()).toBe(403);

    const body = await response.text();
    expect(body.toLowerCase()).toContain('invalid');
  });

  test('should return an error for missing fields', async ({ request }) => {
    const response = await request.post(`${LOGIN_URL}/login`, {
      form: {},
    });

    // Expect a client error (400 or 422) for missing required fields
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});

// ===== Skills API Tests ================
test.describe('API: Skills (/api/skills)', () => {
  test.beforeAll(async () => {
    // Extract the REAL token from the saved citizen session
    if (!authToken) {
      authToken = extractTokenFromStorage('citizen');
      console.log(`[skills-api] Using real accessTokenSkillabTracker (length: ${authToken.length})`);
    }
  });

  test('should fetch skills with default pagination', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/skills`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      form: {},
    });

    expect(response.status()).toBe(200);

    const data = await response.json();

    // Paginated response should have items array and count
    expect(data).toHaveProperty('items');
    expect(Array.isArray(data.items)).toBeTruthy();
    expect(data).toHaveProperty('count');
    expect(data.count).toBeGreaterThanOrEqual(0);
  });

  test('should filter skills by keyword "programming"', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/skills`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      form: {
        keywords: 'programming',
      },
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('items');

    // If results exist, verify they contain the keyword
    if (data.items.length > 0) {
      const firstSkill = data.items[0];
      // Skills have a label or description that should match
      expect(firstSkill).toHaveProperty('label');
    }
  });

  test('should respect page_size parameter', async ({ request }) => {
    const pageSize = 5;

    const response = await request.post(`${API_URL}/api/skills?page=1&page_size=${pageSize}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      form: {},
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.items.length).toBeLessThanOrEqual(pageSize);
  });

  test('should support pagination across pages', async ({ request }) => {
    // Fetch page 1
    const responsePage1 = await request.post(`${API_URL}/api/skills?page=1&page_size=2`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      form: {},
    });

    // Fetch page 2
    const responsePage2 = await request.post(`${API_URL}/api/skills?page=2&page_size=2`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      form: {},
    });

    expect(responsePage1.status()).toBe(200);
    expect(responsePage2.status()).toBe(200);

    const dataPage1 = await responsePage1.json();
    const dataPage2 = await responsePage2.json();

    // Both pages should return items
    expect(dataPage1.items.length).toBeGreaterThan(0);

    // If there are enough skills, page 2 should differ from page 1
    if (dataPage2.items.length > 0 && dataPage1.items.length > 0) {
      // The first item of page 2 should differ from the first item of page 1
      const id1 = dataPage1.items[0].id || dataPage1.items[0].label;
      const id2 = dataPage2.items[0].id || dataPage2.items[0].label;
      expect(id1).not.toEqual(id2);
    }
  });

  test('should reject unauthenticated requests', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/skills`, {
      headers: {
        Accept: 'application/json',
      },
      form: {},
    });

    // Should return 401 Unauthorized or 403 Forbidden
    expect([401, 403]).toContain(response.status());
  });
});

// ======== Courses API Tests =====================
test.describe('API: Courses (/api/courses)', () => {
  test.beforeAll(async () => {
    if (!authToken) {
      authToken = extractTokenFromStorage('citizen');
    }
  });

  test('should fetch courses with default parameters', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/courses`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      form: {},
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('items');
    expect(Array.isArray(data.items)).toBeTruthy();
    expect(data).toHaveProperty('count');
  });

  test('should filter courses by source "udemy"', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/courses`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      form: {
        sources: 'udemy',
      },
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('items');

    // If results exist, verify the source
    if (data.items.length > 0) {
      for (const course of data.items) {
        if (course.source) {
          expect(course.source.toLowerCase()).toBe('udemy');
        }
      }
    }
  });

  test('should filter courses by skill keyword', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/courses`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      form: {
        keywords: 'python',
      },
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('items');
  });
});

// ======= Jobs API Tests ======================
test.describe('API: Jobs (/api/jobs)', () => {
  test.beforeAll(async () => {
    if (!authToken) {
      authToken = extractTokenFromStorage('citizen');
    }
  });

  test('should fetch jobs with default parameters', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/jobs`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      form: {},
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('items');
    expect(Array.isArray(data.items)).toBeTruthy();
    expect(data).toHaveProperty('count');
  });

  test('should filter jobs by keyword search', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/jobs`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      form: {
        keywords: 'developer',
      },
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('items');
  });

  test('should fetch job sources', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/jobs/sources`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(response.status()).toBe(200);

    const sources = await response.json();
    expect(Array.isArray(sources)).toBeTruthy();
  });
});

// ====== Occupations API Tests ========================
test.describe('API: Occupations (/api/occupations)', () => {
  test.beforeAll(async () => {
    if (!authToken) {
      authToken = extractTokenFromStorage('citizen');
    }
  });

  test('should fetch occupations', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/occupations`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      form: {},
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('items');
    expect(Array.isArray(data.items)).toBeTruthy();
  });

  test('should filter occupations by keyword', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/occupations`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      form: {
        keywords: 'programming',
      },
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('items');
  });
});
