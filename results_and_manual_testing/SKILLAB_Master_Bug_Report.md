# SKILLAB Testathon — Master Master Bug Report

---

### SEC_003 — BOLA in /user-management/user/ Endpoint Exposes Sensitive User Data (Password Hashes and Reset Codes)

| Attribute | Details |
| :--- | :--- |
| **Category** | Security - Broken Object Level Authorization (BOLA) / Insecure Direct Object Reference (IDOR) |
| **Severity** | Critical |
| **Priority** | Critical |
| **Tools** | Postman, cURL |

**Description:**
The application's user management API endpoint (/user-management/user/{uuid}) fails to implement proper object-level authorization checks. An authenticated user (e.g., with the "SIMPLE" role) can supply an arbitrary UUID belonging to another user and successfully retrieve their full backend profile.
The vulnerability allows any authenticated user to retrieve the password hashes and active password reset codes of any other user on the platform, leading directly to account takeover and mass credential harvesting.
Furthermore, the API response improperly includes highly sensitive, backend-only fields that should never be exposed to the client-side. This includes the victim's bcrypt password hash, active passResetCode, and passResetIssuedDate. An attacker exploiting this can harvest password hashes for offline cracking or immediately hijack user accounts by utilizing the exposed permanent password reset codes.

**Steps to Reproduce:**
- Log into the application with a standard, low-privileged user account to obtain a valid session token (JWT).
- Identify or enumerate the UUID of a target victim user ([UUID], e.g., 41289887-c0af-4a29-af22-02b478c2eaf4).
- Intercept or construct a GET request to the user profile endpoint: https://portal.skillab-project.eu/user-management/user/[UUID].
- Include the valid Bearer token in the Authorization header.
- Send the request.
- Observe that the server responds with a 200 OK status and returns a JSON object containing the victim's sensitive data, including the password hash and passResetCode.

**Evidence:**
- Image: manual_results/SEC_003_1.png

---

### IDOR_USER_API_001 — Critical IDOR Exposes PII, Password Hashes, and Authentication Secrets

| Attribute | Details |
| :--- | :--- |
| **Category** | Security |
| **Severity** | Critical |
| **Priority** | Critical |
| **Tools** | Burp Suite, cURL |

**Description:**
An Insecure Direct Object Reference (IDOR) on the "/user-management/user" endpoint allows unprivileged users to extract highly sensitive account information of any other user on the platform. By substituting the id parameter with another user's UUID, an attacker can retrieve a complete user object. The exposed JSON response leaks Personally Identifiable Information (PII) including names, emails, and physical addresses. More critically, it exposes internal authentication mechanisms, including bcrypt password hashes, user roles, and password reset token fields. The disclosure of password hashes allows an attacker to perform offline password cracking, which can lead to complete account compromise.

**Steps to Reproduce:**
- Authenticate to the application as a standard user.
- Intercept the HTTP traffic using a web proxy like Burp Suite.
- Trigger a request to the /user-management/user endpoint.
- Send the intercepted request to Burp Suite Repeater.
- Modify the user ID parameter in the request to match the UUID of a different, targeted user.
- Send the modified request.
- Observe that the server responds with a 200 OK status and returns the targeted user's sensitive data in the response body.

**Evidence:**
- **Scripts:** "manual_security/Scripts/IDOR_USER_API_001/"
- **Results:** "manual_security/Results/IDOR_USER_API_001/"

---

### ATO_REGISTRATION_001 — Account Takeover via Improper Upsert Handling on Registration Endpoint

| Attribute | Details |
| :--- | :--- |
| **Category** | Security |
| **Severity** | Critical |
| **Priority** | Critical |
| **Tools** | cURL, Burp Suite |

**Description:**
A critical vulnerability exists on the user registration endpoint (POST /user-management/user) that allows unauthenticated attackers to take over any existing account. The endpoint improperly processes the id parameter in the request body. Instead of rejecting the provided ID or ignoring it to create a new user, the database framework executes an "upsert" (update or insert) operation. By supplying a known user ID along with a new email address and a new password, an attacker can overwrite the victim's authentication credentials without requiring authorization or the victim's current password. Other account attributes (such as user skills) remain untouched, confirming that the existing database record is being hijacked rather than a new one being created.

**Steps to Reproduce:**
- Obtain the id of a target user (e.g., by utilizing the previously documented IDOR vulnerability on the "/user-management/user" GET endpoint).
- Craft a new POST request to the /user-management/user registration endpoint.
- Construct the JSON body with a completely new, unused email address (using an existing email will trigger an "email already used" error) and a new password.
- Inject the id parameter into the JSON payload, setting its value to the target victim's ID.
- Send the POST request to the server.

**Evidence:**
- **Scripts:** "manual_security/Scripts/ATO_REGISTRATION_001/"
- **Results:** "manual_security/Results/ATO_REGISTRATION_001/"

---

### ATO_MASS_ASSIGN_001 — Persistent Account Takeover via Mass Assignment of Password Reset Tokens

| Attribute | Details |
| :--- | :--- |
| **Category** | Security |
| **Severity** | Critical |
| **Priority** | Critical |
| **Tools** | Burp Suite |

**Description:**
The user registration/update endpoint (POST /user-management/user) is vulnerable to Mass Assignment. Attackers can arbitrarily modify internal security fields that should be read-only or system-controlled. By injecting the passResetCode and passResetIssuedDate fields into the JSON payload alongside a target user's UUID, an attacker can overwrite the victim's password reset token. By setting the issued date far into the future (e.g., the year 2099), the attacker creates a persistent backdoor. They can then use this injected token at any time to take over the account via the standard password reset execution endpoint, without altering the user's current password immediately or alerting them.

**Steps to Reproduce:**
- Obtain the id (UUID) of a target user.
- Intercept a POST request to /user-management/user.
- Construct a JSON payload injecting the victim's UUID, a custom passResetCode (e.g., "permanent_code"), and a future passResetIssuedDate (e.g., "2099-05-27T20:55:18.948+00:00").
- Send the request.
- Navigate to the password reset execution endpoint and submit the injected token to successfully change the victim's password.

**Evidence:**
- **Scripts:** "manual_security/Scripts/ATO_MASS_ASSIGN_001/"
- **Results:** "manual_security/Results/ATO_MASS_ASSIGN_001/"

---

### ATO_TOKEN_THEFT_001 — Complete Account Takeover via IDOR and Password Reset Token Theft

| Attribute | Details |
| :--- | :--- |
| **Category** | Security |
| **Severity** | Critical |
| **Priority** | Critical |
| **Tools** | Burp Suite |

**Description:**
This vulnerability chains the Password Reset feature with the previously discovered Insecure Direct Object Reference (IDOR) on the /user-management/user endpoint. Because the IDOR leaks the complete user object—including the currently active passResetCode—an attacker can entirely bypass the email verification requirement of the password reset flow. An attacker can forcefully trigger a password reset for a victim, use the IDOR to extract the newly generated token from the backend, and execute the password change immediately. Alternatively, the attacker can passively monitor a victim's profile via the IDOR and hijack the account whenever the legitimate user requests a password reset.

**Steps to Reproduce:**
- Identify a victim's email address and UUID.
- Send a POST request to /user/reset-password/request with the victim's email to trigger the generation of a new reset token.
- Exploit the IDOR by sending a GET request to /user-management/user using the victim's UUID.
- Review the JSON response body and extract the newly generated value from the passResetCode field.
- Send a PUT request to the password reset execution endpoint using the stolen token and the victim's UUID to set a new password.
- Log in to the victim's account.

**Evidence:**
- **Scripts:** "manual_security/Scripts/ATO_TOKEN_THEFT_001/"
- **Results:** "manual_security/Results/ATO_TOKEN_THEFT_001/"

---

### RBAC-001 — Industry Role Completely Locked Out of Dashboard

| Attribute | Details |
| :--- | :--- |
| **Category** | RBAC / Security |
| **Severity** | Critical |
| **Priority** | Medium |
| **Tools** | Playwright UI Automation, Chromium Browser |

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

| Attribute | Details |
| :--- | :--- |
| **Category** | RBAC / Security |
| **Severity** | Critical |
| **Priority** | Medium |
| **Tools** | Playwright UI Automation, Chromium Browser |

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

| Attribute | Details |
| :--- | :--- |
| **Category** | RBAC / Security |
| **Severity** | Critical |
| **Priority** | High |
| **Tools** | Playwright UI Automation, Chromium Browser |

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

| Attribute | Details |
| :--- | :--- |
| **Category** | RBAC / Security |
| **Severity** | Critical |
| **Priority** | Critical |
| **Tools** | Playwright UI Automation, Chromium Browser |

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

---

### UI-002 — Improper Redirect on User Logout

| Attribute | Details |
| :--- | :--- |
| **Category** | UI / Auth Flow |
| **Severity** | Critical |
| **Priority** | High |
| **Tools** | Playwright UI Automation, Chromium Browser |

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

### REGISTER_002 — Register form lacks password policy validation (length and complexity)

| Attribute | Details |
| :--- | :--- |
| **Category** | Security |
| **Severity** | High |
| **Priority** | High |
| **Tools** | Brave Browser (Version 1.90.124) |

**Description:**
On the public website register page (https://portal.skilllab-project.eu/register), the system does not enforce any password security policy. A user can register using a password of any length (even 1 character) and any format (e.g., no uppercase letters, numbers, or special characters are required).

**Steps to Reproduce:**
- Open the Skilllab public platform registration page. (https://portal.skillab-project.eu/register).
- Fill in the fields
- Enter a very weak password (e.g., "a" or "123")
- Click Register

**Evidence:**
- Video: manual_results/REGISTER_002_1.mp4

---

### SEC_001 — Session remains active after password change

| Attribute | Details |
| :--- | :--- |
| **Category** | Security |
| **Severity** | High |
| **Priority** | High |
| **Tools** | Brave Browser (Version 1.90.124), Chrome Browser (Version 148.0.7778.179) |

**Description:**
The application fails to invalidate existing user sessions after a password change. If a user changes their password, all active sessions on other browsers or devices should be terminated immediately. Currently, a session remains valid and allows continued access to the account even after the password has been updated.

**Steps to Reproduce:**
- Log in to the Skilllab portal on Browser A
- On Browser B, change the password of the account previously logged in
- Once the password change is successful, switch to Browser A.
- Perform an action (e.g., refresh the page or navigate to a restricted section) to check if the session is still active.

**Evidence:**
- Video: manual_results/ SEC_001_1.mp4

---

### SEC_002 — Improper input handling leads to Internal Server Error (500)/Potential XSS

| Attribute | Details |
| :--- | :--- |
| **Category** | Security |
| **Severity** | High |
| **Priority** | High |
| **Tools** | Brave Browser (Version 1.90.124) |

**Description:**
The search input in the Supply/Analytics/Turf section does not properly sanitize or validate user input. Submitting script-like payloads (e.g., <script>alert(1)</script>) triggers an HTTP 500 Internal Server Error.

**Steps to Reproduce:**
- Navigate to the Supply/Analytics/Turf section (https://portal.skillab-project.eu/citizen/supply-analytics  turf section).
- Enter <script>alert(1)</script> in the Keywords field.
- Click "Apply Analysis".
- Inspect the request in the Network tab.

**Evidence:**
- Video: manual_results/SEC_002_1.mp4

---

### BROKEN_AUTH_VALIDATION_001 — Complete Lack of Server-Side Input Validation on Registration Endpoint

| Attribute | Details |
| :--- | :--- |
| **Category** | Security |
| **Severity** | High |
| **Priority** | High |
| **Tools** | cURL, Burp Suite |

**Description:**
The application relies exclusively on client-side controls for input validation during user registration. The backend endpoint (POST /user-management/user) completely fails to implement server-side validation for critical fields, including username length, email format, and password complexity. By bypassing the frontend and sending direct HTTP requests to the API, an attacker can create valid accounts using single-character inputs (e.g., "a") or completely empty strings (""). The only server-side restriction currently enforced is email uniqueness. This absence of backend validation allows for mass creation of garbage accounts (database pollution) and permits users to set dangerously weak passwords, severely undermining the application's authentication security.

**Steps to Reproduce:**
- Bypass the web interface and use an API testing tool (like Burp Suite Repeater or Postman) to craft a POST request to the /user-management/user endpoint.
- Construct a JSON payload for registration, setting the email, username, and password fields to a single letter (e.g., "a"), or alternatively, to empty strings (""). Ensure the email value has not been used previously.
- Send the POST request to the server.

**Evidence:**
- **Scripts:** "manual_security/Scripts/BROKEN_AUTH_VALIDATION_001/"
- **Results:** "manual_security/Results/BROKEN_AUTH_VALIDATION_001/"

---

### BROKEN_AUTH_PASS_RESET_001 — Weak Password Policy Enforcement on Password Reset Execution

| Attribute | Details |
| :--- | :--- |
| **Category** | Security |
| **Severity** | High |
| **Priority** | High |
| **Tools** | Burp Suite |

**Description:**
The password reset execution endpoint (PUT /user-management/user/reset-password/request) fails to enforce industry-standard password complexity and length requirements. The backend validation only checks that the password string is 3 characters or longer. By bypassing frontend validation, an attacker or user can set an extremely weak password during the reset flow. This critical lack of server-side enforcement leaves accounts highly vulnerable to brute-force, credential stuffing, and dictionary attacks.

**Steps to Reproduce:**
- Intercept the password reset PUT request using a web proxy.
- Ensure you have a valid token and uuid for the target account.
- Modify the password field in the JSON payload to a simple 3-character string (e.g., "aaa").
- Send the request to the server.

**Evidence:**
- **Scripts:** "manual_security/Scripts/BROKEN_AUTH_PASS_RESET_001/"
- **Results:** "manual_security/Results/BROKEN_AUTH_PASS_RESET_001/"

---

### API-002 — Critical Timeout on Job Sources Endpoint (GET /api/jobs/sources)

| Attribute | Details |
| :--- | :--- |
| **Category** | API |
| **Severity** | High |
| **Priority** | High |
| **Tools** | Playwright API Testing context |

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

| Attribute | Details |
| :--- | :--- |
| **Category** | UI / Navigation |
| **Severity** | High |
| **Priority** | High |
| **Tools** | Playwright UI Automation, Chromium Browser |

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

### FORGOT_PW_001 — "Forgot Password" feature is vulnerable to user enumeration

| Attribute | Details |
| :--- | :--- |
| **Category** | Security |
| **Severity** | Medium |
| **Priority** | Medium |
| **Tools** | Brave Browser (Version 1.90.124) |

**Description:**
The "Forgot Password" feature is vulnerable to user enumeration. When an invalid or non-existent email address is entered, the system explicitly returns the error message: "User with email [email] doesn't exist!". This allows unauthorized users to verify whether specific email addresses are registered in the system.

**Steps to Reproduce:**
- Navigate to the "Forgot Password" page (https://portal.skilllab-project.eu/forgot-password).
- Enter an email address that is definitely not registered in the system (e.g., random.test.email.123@example.com).
- Click the "SEND PASSWORD RESET LINK" button.
- Observe the error message displayed.

**Evidence:**
- Video: manual_results/ FORGOT_PW_001_1.mp4

---

### LOGIN_001 — Login form allows unlimited character input, causing page freeze

| Attribute | Details |
| :--- | :--- |
| **Category** | UI/UX |
| **Severity** | Medium |
| **Priority** | Medium |
| **Tools** | Brave Browser (Version 1.90.124) |

**Description:**
On the public website login page (https://portal.skilllab-project.eu/login), the email and password fields lack character limits. Inputting an excessively large volume of characters eventually blocks the page on the user side.

**Steps to Reproduce:**
- Open the Skilllab public platform (https://portal.skilllab-project.eu/login).
- Paste a very large string of characters (e.g. 50,000+ characters) into the Email or Password field.
- Continue entering characters until the browser tab becomes unresponsive.

**Evidence:**
- Images: manual_results/LOGIN_001_2.png
- Video: manual_results/LOGIN_001_1.mp4

---

### LOGIN_003 — Login form accepts empty/blank credentials

| Attribute | Details |
| :--- | :--- |
| **Category** | Functional |
| **Severity** | Medium |
| **Priority** | Medium |
| **Tools** | Brave Browser (Version 1.90.124) |

**Description:**
The login form does not perform proper validation for empty or blank input fields. When the "Login" button is clicked without providing an email and password, the system sends an empty request to the server.

**Steps to Reproduce:**
- Go to the login page: https://portal.skilllab-project.eu/login.
- Leave both the "Email" and "Password" fields empty.
- Open the Network tab in Developer Tools (F12).
- Click the "Login" button.
- Observe that the system sends an empty/blank request to the server instead of displaying validation errors.

**Evidence:**
- Video: manual_results/ LOGIN_003_1.mp4

---

### REGISTER_001 — Register form allows unlimited character input, causing page freeze, and the form to break

| Attribute | Details |
| :--- | :--- |
| **Category** | UI/UX |
| **Severity** | Medium |
| **Priority** | Medium |
| **Tools** | Brave Browser (Version 1.90.124) |

**Description:**
On the public website register page (https://portal.skillab-project.eu/register), the fields lack character limits. Inputting an excessively large volume of characters eventually blocks the page on the user side.

**Steps to Reproduce:**
- Open the Skilllab public platform and press register (https://portal.skillab-project.eu/register).
- Paste a very large string of characters (e.g. 50,000+ characters) into the Email or Password field.
- Continue entering characters until the browser tab becomes unresponsive.

**Evidence:**
- Images: manual_results/REGISTER_001_1.png
- Video: manual_results/REGISTER_001_2.mp4

---

### SEARCH_001 — Error for invalid search and loading state persists indefinitely after failed search validation

| Attribute | Details |
| :--- | :--- |
| **Category** | Functional |
| **Severity** | Medium |
| **Priority** | Medium |
| **Tools** | Brave Browser (Version 1.90.124) |

**Description:**
When clicking "Apply" on the [Demand/Analytics/Biodiversity] search filter without selecting any option, an error is triggered. After closing the error notification, the UI remains stuck in a "Loading" state (loading animation persists), preventing the user from performing subsequent searches or interacting with the page.

**Steps to Reproduce:**
- Navigate from the main page to Demand/Analytics/Biodiversity or select Biodiversity on https://portal.skillab-project.eu/citizen/demand-analytics
- Enter random a text that is not in the list, in the field
- Click the "Apply" button.
- Observe the error message triggered by the system.
- Close the error message/notification.
- Observe the UI state (loading animation).

**Evidence:**
- Video: manual_results/SEARCH_001_1.mp4

---

### SEARCH_002 — Search request hangs in "Pending" state when entering invalid keywords

| Attribute | Details |
| :--- | :--- |
| **Category** | Integration |
| **Severity** | Medium |
| **Priority** | Medium |
| **Tools** | Brave Browser (Version 1.90.124) |

**Description:**
The apply analysis functionality in the Supply/Analytics/Turf (https://portal.skillab-project.eu/citizen/supply-analytics  turf section) section fails to handle invalid user input. When a user inputs arbitrary text that does not match any of the provided filter options and clicks "Apply Analysis", the application sends a request that remains stuck in a "Pending" state indefinitely.

**Steps to Reproduce:**
- Open the Network tab in Developer Tools (F12)
- Navigate to the Supply/Analytics/Turf section (https://portal.skillab-project.eu/citizen/supply-analytics  turf section).
- In the keywords field, enter a random string that is not among the suggested options.
- Click the "Apply Analysis" button.
- Monitor the request in the Network tab.

**Evidence:**
- Video: manual_results/SEARCH_002_1.mp4

---

### SEARCH_003 — Keywords field allows unlimited character input, causing page freeze

| Attribute | Details |
| :--- | :--- |
| **Category** | UI/UX |
| **Severity** | Medium |
| **Priority** | Medium |
| **Tools** | Brave Browser (Version 1.90.124) |

**Description:**
On the public website page, Supply/Analytics/Turf section (https://portal.skillab-project.eu/citizen/supply-analytics  turf section), the keyword field lacks character limits. Inputting an excessively large volume of characters eventually blocks the page on the user side, and breaks it.

**Steps to Reproduce:**
- Navigate to the Supply/Analytics/Turf section (https://portal.skillab-project.eu/citizen/supply-analytics  turf section).
- Paste a very large string of characters (e.g. 50,000+ characters) into the Keywords field.
- Continue entering characters until the browser tab becomes unresponsive.

**Evidence:**
- Video: manual_results/SEARCH_003_1.mp4

---

### SEARCH_004 — Keywords field from Supply/Analytics/Co-occurrence allows unlimited character input, causing page freeze

| Attribute | Details |
| :--- | :--- |
| **Category** | UI/UX |
| **Severity** | Medium |
| **Priority** | Medium |
| **Tools** | Brave Browser (Version 1.90.124) |

**Description:**
On the public website page, Supply/Analytics/Co-occurrence section (https://portal.skillab-project.eu/citizen/supply-analytics  Co-occurence section), the Keywords field lacks character limits. Inputting an excessively large volume of characters eventually blocks the page on the user side, and breaks it.

**Steps to Reproduce:**
- Navigate to the Supply/Analytics/Co-occurrence section (https://portal.skillab-project.eu/citizen/supply-analytics  Co-occurence section)
- Paste a very large string of characters (e.g. 50,000+ characters) into the Keywords field.
- Continue entering characters until the browser tab becomes unresponsive.

**Evidence:**
- Video: manual_results/SEARCH_004_1.mp4

---

### INFO_LEAK_ERROR_HANDLING_001 — Information Disclosure via Improper Error Handling on User Management Endpoint (GET/POST)

| Attribute | Details |
| :--- | :--- |
| **Category** | Security |
| **Severity** | Medium |
| **Priority** | Medium |
| **Tools** | Burp Suite |

**Description:**
By fuzzing the /user-management/user endpoint across multiple HTTP methods (GET and POST) with malformed parameters, unexpected data types, and missing mandatory fields, the server fails to handle exceptions gracefully. Instead of returning standardized API error messages, the backend leaks verbose internal stack traces (including Java parsing errors, framework-specific exceptions, and internal class models). This information disclosure provides attackers with deep insight into the backend architecture, technologies in use, and internal code paths. Grouping these errors indicates the absence of a global exception handler spanning the application's controllers.

**Steps to Reproduce:**
- Intercept or construct a request to the /user-management/user endpoint using an API testing tool.
- Fuzz the GET method by supplying an improperly formatted UUID parameter.
- Fuzz the endpoint by sending various anomalous payloads.
- Send the manipulated requests to the server.

**Evidence:**
- **Scripts:** "manual_security/Scripts/INFO_LEAK_ERROR_HANDLING_001/"
- **Results:** "manual_security/Results/INFO_LEAK_ERROR_HANDLING_001/"

---

### ENUM_INFO_LEAK_PASS_RESET_001 — User Enumeration and Information Disclosure via Improper Exception Handling on Password Reset

| Attribute | Details |
| :--- | :--- |
| **Category** | Security |
| **Severity** | Medium |
| **Priority** | Medium |
| **Tools** | Burp Suite |

**Description:**
The password reset request endpoint (/user/reset-password/request) is vulnerable to both user enumeration and information disclosure. First, the application behaves differently depending on whether the submitted email address exists in the database, allowing attackers to harvest valid accounts. Second, the endpoint fails to validate input length safely. Submitting a single-character email address triggers an unhandled backend exception that exposes verbose internal stack traces. The resulting HTTP 500 Internal Server Error leaks the underlying Java exception (javax.mail.SendFailedException) and reveals the backend's email infrastructure details, specifically exposing that the application is routing mail through Google's SMTP servers (gsmtp).

**Steps to Reproduce:**
- Navigate to the password reset feature or intercept requests to /user/reset-password/request.
- Submit a payload containing a known valid email address and observe the successful response.
- Submit a payload containing an invalid email address with a length greater than 2 characters (e.g., fake-user123@example.com).
- Submit a payload containing a string of 2 characters or fewer (e.g., a).
- Compare the server's responses across the three scenarios, noting the verbose stack trace in the final payload's response.

**Evidence:**
- **Scripts:** "manual_security/Scripts/ENUM_INFO_LEAK_PASS_RESET_001/"
- **Results:** "manual_security/Results/ENUM_INFO_LEAK_PASS_RESET_001/"

---

### RATE_LIMIT_PASS_RESET_001 — Lack of Rate Limiting on Password Reset Enables Email Bombing

| Attribute | Details |
| :--- | :--- |
| **Category** | Security |
| **Severity** | Medium |
| **Priority** | Medium |
| **Tools** | Burp Suite |

**Description:**
The /user/reset-password/request endpoint does not implement rate limiting or anti-automation controls (such as CAPTCHA). An attacker can abuse this endpoint by rapidly and continuously submitting POST requests with a valid user's email address. This causes the application to aggressively dispatch password reset emails to the victim. This flaw allows for email bombing (a form of targeted harassment and Denial of Service against the user's inbox) and can severely degrade the application's domain reputation with major email service providers, potentially causing legitimate application emails to be flagged as spam.

**Steps to Reproduce:**
- Identify a valid user email address registered to the application.
- Intercept the password reset POST request to /user/reset-password/request.
- Send the intercepted request to an automated testing tool like Burp Suite Intruder.
- Configure the tool to send a high volume of identical requests (e.g., 50 requests in a few seconds) targeting the victim's email.
- Monitor the server's HTTP responses and the victim's email inbox.

**Evidence:**
- **Scripts:** "manual_security/Scripts/RATE_LIMIT_PASS_RESET_001/"
- **Results:** "manual_security/Results/RATE_LIMIT_PASS_RESET_001/"

---

### INFO_LEAK_ERROR_HANDLING_002 — Information Disclosure via Improper Error Handling on Password Reset Endpoint

| Attribute | Details |
| :--- | :--- |
| **Category** | Security |
| **Severity** | Medium |
| **Priority** | Medium |
| **Tools** | Burp Suite |

**Description:**
Fuzzing the PUT /user-management/user/reset-password/request endpoint with malformed payloads, mismatched relational data, and missing fields causes the backend to fail ungracefully. Instead of returning standardized API errors, the server responds with HTTP 400 and HTTP 500 status codes that leak internal Java errors. Notably, submitting a valid token for User A alongside the UUID of User B causes a server crash, indicating improper handling of database relational checks. These verbose errors provide attackers with unnecessary insight into the backend architecture and data models.

**Steps to Reproduce:**
- Intercept or construct a PUT request to /user-management/user/reset-password/request.
- Fuzz the endpoint by sending various anomalous JSON payloads, including:
  - Sending a valid token belonging to one user, but the uuid of a different user.
  - Sending a valid uuid but a null value for the token.
  - Submitting an entirely empty JSON body or missing mandatory fields.
  - Submitting structurally malformed data (e.g., broken JSON syntax).
- Send the manipulated requests and observe the server responses.

**Evidence:**
- **Scripts:** "manual_security/Scripts/INFO_LEAK_ERROR_HANDLING_002/"
- **Results:** "manual_security/Results/INFO_LEAK_ERROR_HANDLING_002/"

---

### API-001 — Empty Response Body on Failed Authentication (POST /login)

| Attribute | Details |
| :--- | :--- |
| **Category** | API |
| **Severity** | Medium |
| **Priority** | Medium |
| **Tools** | Playwright API Testing context, Local Docker Environment |

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

### LOGIN_002 — Failed login attempt returns HTTP 403 Forbidden instead of 401 Unauthorized

| Attribute | Details |
| :--- | :--- |
| **Category** | Integration |
| **Severity** | Low |
| **Priority** | Low |
| **Tools** | Brave Browser (Version 1.90.124) |

**Description:**
When attempting to log in to the portal (https://portal.skilllab-project.eu/login) with invalid credentials, the server returns an HTTP 403 Forbidden status code. According to HTTP protocol standards, a failed authentication attempt due to incorrect credentials should return 401 Unauthorized. The current behavior suggests a misconfiguration in the authentication/authorization middleware on the backend.

**Steps to Reproduce:**
- Navigate to the login page: https://portal.skilllab-project.eu/login.
- Open the browser's Developer Tools (F12) and switch to the Network tab.
- Enter an incorrect password or email in the login fields.
- Click the Login button.
- Locate the network request (usually named login or auth) in the list and inspect the Status Code.

**Evidence:**
- Video: manual_results/LOGIN_002_1.mp4

---

### UX_001 — Missing auto-login flow after successful registration

| Attribute | Details |
| :--- | :--- |
| **Category** | UI/UX |
| **Severity** | Low |
| **Priority** | Low |
| **Tools** | Brave Browser (Version 1.90.124) |

**Description:**
After a successful registration, the user is redirected to the login page and is forced to manually enter their credentials again to access the account. This breaks the expected workflow and decreases the user experience.

**Steps to Reproduce:**
- Navigate to the registration page (https://portal.skillab-project.eu/register).
- Fill in all required fields with new, valid data, so that a new account can be created.
- Submit the registration form.
- Observe that the user is redirected to the login page (https://portal.skillab-project.eu/login) instead of being automatically logged in.

**Evidence:**
- Video: manual_results/UX_001_1.mp4

---

### UX_002 — Mobile layout breaks when accessing navigation menus

| Attribute | Details |
| :--- | :--- |
| **Category** | UI/UX |
| **Severity** | Low |
| **Priority** | Medium |
| **Tools** | Brave Browser (Version 1.90.124) |

**Description:**
When opening the top or side navigation menus, the elements shift the entire page content to the right instead of overlaying it. This forces horizontal scrolling and makes the interface difficult to navigate on mobile devices.

**Steps to Reproduce:**
- Open the application in a browser.
- Login
- Open Developer Tools (F12) and toggle "Device Toolbar" (or press Ctrl+Shift+M).
- Select a mobile device resolution.
- Click on the navigation menu (top or right).
- Observe the shift in the page layout.

**Evidence:**
- Video: manual_results/UX_002_1.mp4

---

### UX_003 — Generic and misleading error message displayed instead of specific input validation error

| Attribute | Details |
| :--- | :--- |
| **Category** | UI/UX |
| **Severity** | Low |
| **Priority** | Low |
| **Tools** | Brave Browser (Version 1.90.124) |

**Description:**
When the user enters a numeric value that exceeds the maximum integer limit in the "Forecast Horizon (Months)" field, the server correctly identifies the issue and returns a descriptive JSON error (Unable to parse input string as an integer, exceeded maximum size). However, the frontend ignores this specific error and displays a generic, misleading message: "Failed to fetch forecast data. The service might be temporarily unavailable.".

**Steps to Reproduce:**
- Navigate to https://portal.skillab-project.eu/citizen/demand-forecasting.
- Select the "Timeseries" tab.
- In the "Forecast Horizon (Months)" field, enter a very large number (e.g., 12000000000000000000000000000000000000000).
- Click "Run Forecast".
- Observe the UI error message and simultaneously check the "Network" tab in Developer Tools for the actual server response.

**Evidence:**
- Video: manual_results/UX_003_1.mp4

---

### DESIGN_001 — Layout shift in "My Skills" section

| Attribute | Details |
| :--- | :--- |
| **Category** | UI/UX |
| **Severity** | Low |
| **Priority** | Low |
| **Tools** | Brave Browser (Version 1.90.124) |

**Description:**
In the "My Skills" section, the appearance of the "Loading..." text during a search operation causes a visual shift (misalignment) of the surrounding form elements. The layout dynamically adjusts to accommodate the loading text.

**Steps to Reproduce:**
- Login
- Navigate to the "My Skills" section within the user profile.
- Start typing in the search/input field to add a new skill.
- Observe the UI when the "Loading..." indicator appears.

**Evidence:**
- Video: manual_results/DESIGN_001_1.mp4

---

### DESIGN_002 — Layout misalignment in Demand and Supply, Forecasting/Ageing sections

| Attribute | Details |
| :--- | :--- |
| **Category** | UI/UX |
| **Severity** | Low |
| **Priority** | Low |
| **Tools** | Brave Browser (Version 1.90.124) |

**Description:**
There is a noticeable inconsistency in the alignment of form components between the "Demand/Forecasting/Ageing" and "Supply/Forecasting/Ageing" sections. The input fields and buttons are not positioned uniformly, creating a disjointed visual experience when switching between these modules.

**Steps to Reproduce:**
- Login
- Navigate to the Demand/Forecasting/Ageing section and to the Supply/Forecasting/Ageing section

**Evidence:**
- Image: manual_results/DESIGN_002_1.png
- manual_results/DESIGN_002_2.png

---

### DESIGN_003 — Layout misalignment in Deman/Analytics, Turf Analysis form

| Attribute | Details |
| :--- | :--- |
| **Category** | UI/UX |
| **Severity** | Low |
| **Priority** | Low |
| **Tools** | Brave Browser (Version 1.90.124) |

**Description:**
The Turf Analysis form exhibits a visual layout inconsistency where the 'Combinations' dropdown and the 'Select Pillar' component are not vertically or horizontally aligned with the surrounding elements. This misalignment disrupts the visual hierarchy of the form, causing it to appear unpolished.

**Steps to Reproduce:**
- Login
- Navigate to Demand/Analytics (https://portal.skillab-project.eu/citizen/demand-analytics), to Turf tab
- Observe the misalignment in the Turf Analysis form

**Evidence:**
- Images: manual_results/DESIGN_003_1.png

---

### DESIGN_004 — Layout misalignment in Supply/Analytics, Turf Analysis form

| Attribute | Details |
| :--- | :--- |
| **Category** | UI/UX |
| **Severity** | Low |
| **Priority** | Low |
| **Tools** | Brave Browser (Version 1.90.124) |

**Description:**
The Turf Analysis form in the 'Supply/Analytics' module exhibits a visual layout misalignment. The input field 'Keywords', the 'Combinations' dropdown, and the 'Select Pillar' button do not share consistent horizontal or vertical alignment.

**Steps to Reproduce:**
- Login
- Navigate to Supply/Analytics (https://portal.skillab-project.eu/citizen/supply-analytics), to Turf tab
- Observe the misalignment in the Turf Analysis form

**Evidence:**
- Images: manual_results/DESIGN_004_1.png

---

### UI_001 — Unresolved placeholder text in notification dropdown

| Attribute | Details |
| :--- | :--- |
| **Category** | UI/UX |
| **Severity** | Low |
| **Priority** | Low |
| **Tools** | Web Browser |

**Description:**
On the authenticated "My Account" dashboard, the notification dropdown menu in the top navigation bar contains unresolved boilerplate placeholder text. When the user clicks the bell icon, the menu displays generic items ("Action", "Another Action", "Something else here") instead of functional links or actual system notifications.

**Steps to Reproduce:**
- Log in to the application and navigate to the "My Account" dashboard.
- Locate the notification bell icon in the top right corner of the global navigation bar.
- Click the bell icon to expand the dropdown menu.
- Observe that the menu items display generic placeholder text ("Action", "Another Action", "Something else here").

**Evidence:**
- Images: manual_results/UI_001_1.png
