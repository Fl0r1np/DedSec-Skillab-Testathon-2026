# SKILLAB Testathon — Bug Report (Artifact 3)

---

### API-001 — Empty Response Body on Failed Authentication (POST /login)

- **Bug ID:** API-001
- **Category:** API
- **Severity:** Medium
- **Priority:** Medium
- **Tools:** Playwright API Testing context, Local Docker Environment

**Description:**
The API returns an empty response body when invalid credentials are submitted. The server correctly responds with HTTP 403, but the body contains no human-readable error message (e.g., "Invalid credentials"). Users and integrators receive no feedback explaining why authentication was rejected.

**Steps to Reproduce:**

1. Send a POST request to http://localhost:8081/login
2. Use invalid credentials: email=nonexistent@user.com, password=wrongpassword
3. Observe the response status is 403 (correct)
4. Observe the response body is an empty string instead of containing a descriptive error message

**Evidence:**

- **Test Script:** `skills-api.spec.js` — `API: Authentication (POST /login on port 8081) › should return 403 for invalid credentials`
- **Trace:** `automated_testing/test-results/api-skills-api-API-Authent-efefa-403-for-invalid-credentials-chromium/trace.zip`

---

### API-002 — Critical Timeout on Job Sources Endpoint (GET /api/jobs/sources)

- **Bug ID:** API-002
- **Category:** API
- **Severity:** High
- **Priority:** High
- **Tools:** Playwright API Testing context

**Description:**
The Job Sources endpoint fails to respond within 30 seconds, causing a complete request timeout. The remote endpoint (skillab-tracker.csd.auth.gr) is unreachable or critically slow, preventing any consumer from retrieving the list of available job data sources.

**Steps to Reproduce:**

1. Authenticate as a valid Citizen user and obtain a Bearer token
2. Send a GET request to https://skillab-tracker.csd.auth.gr/api/jobs/sources with a valid Authorization: Bearer <token> header
3. Wait for the server response
4. Observe the request hangs and times out after 30 seconds with no response

**Evidence:**

- **Test Script:** `skills-api.spec.js` — `API: Jobs (/api/jobs) › should fetch job sources`
- **Trace:** `automated_testing/test-results/api-skills-api-API-Jobs-api-jobs-should-fetch-job-sources-chromium/trace.zip`

---

### UI-001 — Inaccessible Forecasting Link in Citizen Sidebar

- **Bug ID:** UI-001
- **Category:** UI / Navigation
- **Severity:** High
- **Priority:** High
- **Tools:** Playwright UI Automation, Chromium Browser

**Description:**
The "Forecasting" link under the "Supply" sidebar section is present in the DOM but is not visible or clickable. After expanding the Supply collapsible menu, the Forecasting navigation item remains hidden, preventing Citizen users from accessing the Supply Forecasting page via the sidebar.

**Steps to Reproduce:**

1. Log in as a Citizen user
2. Navigate to /citizen/account
3. In the left sidebar, click "Supply" to expand the collapsible section
4. Attempt to click the "Forecasting" sub-link
5. Observe the link element exists in the DOM but is not visible and cannot be clicked

**Evidence:**

- **Test Script:** `citizen-login.spec.js` — `Citizen Dashboard — Post-Login Verification › should navigate to Supply Forecasting via sidebar`
- **Screenshot:** `automated_testing/test-results/auth-citizen-login-Citizen-f25d4-ply-Forecasting-via-sidebar-chromium/test-failed-1.png`
- **Trace:** `automated_testing/test-results/auth-citizen-login-Citizen-f25d4-ply-Forecasting-via-sidebar-chromium/trace.zip`

---

### UI-002 — Improper Redirect on User Logout

- **Bug ID:** UI-002
- **Category:** UI / Auth Flow
- **Severity:** Critical
- **Priority:** High
- **Tools:** Playwright UI Automation, Chromium Browser

**Description:**
The logout action does not redirect the user to the /login page. After clicking the logout link, the application navigates to the root URL (http://localhost:3000/) — the public homepage — instead of the login page. This indicates the user session may not be properly invalidated and creates a confusing user experience.

**Steps to Reproduce:**

1. Log in as a Citizen user
2. Navigate to /citizen/account
3. Click the "Logout" link in the top navigation bar
4. Wait for the redirect
5. Observe the browser lands on http://localhost:3000/ instead of /login

**Evidence:**

- **Test Script:** `citizen-login.spec.js` — `Citizen Dashboard — Post-Login Verification › should logout and return to login page`
- **Screenshot:** `automated_testing/test-results/auth-citizen-login-Citizen-7867d-ut-and-return-to-login-page-chromium/test-failed-1.png`
- **Trace:** `automated_testing/test-results/auth-citizen-login-Citizen-7867d-ut-and-return-to-login-page-chromium/trace.zip`

---

### RBAC-001 — Industry Role Completely Locked Out of Dashboard

- **Bug ID:** RBAC-001
- **Category:** RBAC / Security
- **Severity:** Critical
- **Priority:** Blocker
- **Tools:** Playwright UI Automation, Chromium Browser

**Description:**
An authenticated Industry user is unable to access their own dashboard. When navigating to /industry/account, the application redirects the user to the /login page, as though the session is invalid or the role is unrecognized. This completely blocks the Industry stakeholder from using the platform.

**Steps to Reproduce:**

1. Log in as an Industry-role user (using stored industry session state)
2. Navigate to /industry/account
3. Wait for the page to load
4. Observe the URL changes to http://localhost:3000/login instead of staying on /industry/account
5. The sidebar and dashboard content are absent

**Evidence:**

- **Test Script:** `role-access.spec.js` — `RBAC: Industry Role › should access /industry routes`
- **Screenshot:** `automated_testing/test-results/rbac-role-access-RBAC-Indu-df96a-ould-access-industry-routes-chromium/test-failed-1.png`
- **Trace:** `automated_testing/test-results/rbac-role-access-RBAC-Indu-df96a-ould-access-industry-routes-chromium/trace.zip`

---

### RBAC-002 — Education Role Missing Sidebar Navigation

- **Bug ID:** RBAC-002
- **Category:** RBAC / Security
- **Severity:** Critical
- **Priority:** Blocker
- **Tools:** Playwright UI Automation, Chromium Browser

**Description:**
An authenticated Education user can navigate to /education/account and the URL is retained, but the sidebar component fails to render. The page loads without the primary navigation panel, leaving the user stranded with no way to navigate to other sections of the Education dashboard.

**Steps to Reproduce:**

1. Log in as an Education-role user (using stored education session state)
2. Navigate to /education/account
3. Wait for the page to fully load
4. Observe the URL correctly contains /education
5. Observe the .sidebar element is missing from the DOM entirely

**Evidence:**

- **Test Script:** `role-access.spec.js` — `RBAC: Education Role › should access /education routes`
- **Screenshot:** `automated_testing/test-results/rbac-role-access-RBAC-Educ-a29e8-uld-access-education-routes-chromium/test-failed-1.png`
- **Trace:** `automated_testing/test-results/rbac-role-access-RBAC-Educ-a29e8-uld-access-education-routes-chromium/trace.zip`

---

### RBAC-003 — Policy Role Redirected to Public Homepage

- **Bug ID:** RBAC-003
- **Category:** RBAC / Security
- **Severity:** Critical
- **Priority:** Blocker
- **Tools:** Playwright UI Automation, Chromium Browser

**Description:**
An authenticated Policy user is unable to access the Policy dashboard. When navigating to /policy/account, the application redirects the user to the root URL (http://localhost:3000/) instead of rendering the Policy workspace. The Policy stakeholder is completely locked out of their designated area.

**Steps to Reproduce:**

1. Log in as a Policy-role user (using stored policy session state)
2. Navigate to /policy/account
3. Wait for the page to load
4. Observe the URL changes to http://localhost:3000/ instead of staying on /policy
5. The sidebar and dashboard content are absent

**Evidence:**

- **Test Script:** `role-access.spec.js` — `RBAC: Policy Role › should access /policy routes`
- **Screenshot:** `automated_testing/test-results/rbac-role-access-RBAC-Poli-90efd-should-access-policy-routes-chromium/test-failed-1.png`
- **Trace:** `automated_testing/test-results/rbac-role-access-RBAC-Poli-90efd-should-access-policy-routes-chromium/trace.zip`

---

### RBAC-004 — Admin Role Locked Out of Admin Panel

- **Bug ID:** RBAC-004
- **Category:** RBAC / Security
- **Severity:** Critical
- **Priority:** Blocker
- **Tools:** Playwright UI Automation, Chromium Browser

**Description:**
An authenticated Admin user is unable to access the Admin panel. When navigating to /admin, the application redirects the user to the root URL (http://localhost:3000/) instead of the admin dashboard. The admin is unable to access administrative functionality, which constitutes a total loss of system management capabilities.

**Steps to Reproduce:**

1. Log in as an Admin-role user (using stored admin session state)
2. Navigate to /admin
3. Wait for the page to load
4. Observe the URL changes to http://localhost:3000/ instead of staying on /admin
5. No admin dashboard or sidebar content is rendered

**Evidence:**

- **Test Script:** `role-access.spec.js` — `RBAC: Admin Role › should access /admin routes`
- **Screenshot:** `automated_testing/test-results/rbac-role-access-RBAC-Admin-Role-should-access-admin-routes-chromium/test-failed-1.png`
- **Trace:** `automated_testing/test-results/rbac-role-access-RBAC-Admin-Role-should-access-admin-routes-chromium/trace.zip`