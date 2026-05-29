### Critical IDOR Exposes PII, Password Hashes, and Authentication Secrets

**Bug ID:** IDOR_USER_API_001
**Category:** Security
**Severity:** Critical
**Priority:** Critical

**Description:** An Insecure Direct Object Reference (IDOR) on the "/user-management/user" endpoint allows unprivileged users to extract highly sensitive account information of any other user on the platform. By substituting the id parameter with another user's UUID, an attacker can retrieve a complete user object. The exposed JSON response leaks Personally Identifiable Information (PII) including names, emails, and physical addresses. More critically, it exposes internal authentication mechanisms, including bcrypt password hashes, user roles, and password reset token fields. The disclosure of password hashes allows an attacker to perform offline password cracking, which can lead to complete account compromise.

**Tools:** Burp Suite, cURL

**Steps to reproduce:**

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

### Account Takeover via Improper Upsert Handling on Registration Endpoint

**Bug ID:** ATO_REGISTRATION_001
**Category:** Security
**Severity:** Critical
**Priority:** Critical

**Description:** A critical vulnerability exists on the user registration endpoint (POST /user-management/user) that allows unauthenticated attackers to take over any existing account. The endpoint improperly processes the id parameter in the request body. Instead of rejecting the provided ID or ignoring it to create a new user, the database framework executes an "upsert" (update or insert) operation. By supplying a known user ID along with a new email address and a new password, an attacker can overwrite the victim's authentication credentials without requiring authorization or the victim's current password. Other account attributes (such as user skills) remain untouched, confirming that the existing database record is being hijacked rather than a new one being created.

**Tools:** cURL, Burp Suite

**Steps to reproduce:**

- Obtain the id of a target user (e.g., by utilizing the previously documented IDOR vulnerability on the "/user-management/user" GET endpoint).
- Craft a new POST request to the /user-management/user registration endpoint.
- Construct the JSON body with a completely new, unused email address (using an existing email will trigger an "email already used" error) and a new password.
- Inject the id parameter into the JSON payload, setting its value to the target victim's ID.
- Send the POST request to the server.

**Evidence:**

- **Scripts:** "manual_security/Scripts/ATO_REGISTRATION_001/"
- **Results:** "manual_security/Results/ATO_REGISTRATION_001/"

---

### Complete Lack of Server-Side Input Validation on Registration Endpoint

**Bug ID:** BROKEN_AUTH_VALIDATION_001
**Category:** Security
**Severity:** High
**Priority:** High

**Description:** The application relies exclusively on client-side controls for input validation during user registration. The backend endpoint (POST /user-management/user) completely fails to implement server-side validation for critical fields, including username length, email format, and password complexity. By bypassing the frontend and sending direct HTTP requests to the API, an attacker can create valid accounts using single-character inputs (e.g., "a") or completely empty strings (""). The only server-side restriction currently enforced is email uniqueness. This absence of backend validation allows for mass creation of garbage accounts (database pollution) and permits users to set dangerously weak passwords, severely undermining the application's authentication security.

**Tools:** cURL, Burp Suite

**Steps to reproduce:**

- Bypass the web interface and use an API testing tool (like Burp Suite Repeater or Postman) to craft a POST request to the /user-management/user endpoint.
- Construct a JSON payload for registration, setting the email, username, and password fields to a single letter (e.g., "a"), or alternatively, to empty strings (""). Ensure the email value has not been used previously.
- Send the POST request to the server.

**Evidence:**

- **Scripts:** "manual_security/Scripts/BROKEN_AUTH_VALIDATION_001/"
- **Results:** "manual_security/Results/BROKEN_AUTH_VALIDATION_001/"

---

### Information Disclosure via Improper Error Handling on User Management Endpoint (GET/POST)

**Bug ID:** INFO_LEAK_ERROR_HANDLING_001
**Category:** Security
**Severity:** Medium
**Priority:** Medium

**Description:** By fuzzing the /user-management/user endpoint across multiple HTTP methods (GET and POST) with malformed parameters, unexpected data types, and missing mandatory fields, the server fails to handle exceptions gracefully. Instead of returning standardized API error messages, the backend leaks verbose internal stack traces (including Java parsing errors, framework-specific exceptions, and internal class models). This information disclosure provides attackers with deep insight into the backend architecture, technologies in use, and internal code paths. Grouping these errors indicates the absence of a global exception handler spanning the application's controllers.

**Tools:** Burp Suite

**Steps to reproduce:**

- Intercept or construct a request to the /user-management/user endpoint using an API testing tool.
- Fuzz the GET method by supplying an improperly formatted UUID parameter.
- Fuzz the endpoint by sending various anomalous payloads.
- Send the manipulated requests to the server.

**Evidence:**

- **Scripts:** "manual_security/Scripts/INFO_LEAK_ERROR_HANDLING_001/"
- **Results:** "manual_security/Results/INFO_LEAK_ERROR_HANDLING_001/"

---

### User Enumeration and Information Disclosure via Improper Exception Handling on Password Reset

**Bug ID:** ENUM_INFO_LEAK_PASS_RESET_001
**Category:** Security
**Severity:** Medium
**Priority:** Medium

**Description:** The password reset request endpoint (/user/reset-password/request) is vulnerable to both user enumeration and information disclosure. First, the application behaves differently depending on whether the submitted email address exists in the database, allowing attackers to harvest valid accounts. Second, the endpoint fails to validate input length safely. Submitting a single-character email address triggers an unhandled backend exception that exposes verbose internal stack traces. The resulting HTTP 500 Internal Server Error leaks the underlying Java exception (javax.mail.SendFailedException) and reveals the backend's email infrastructure details, specifically exposing that the application is routing mail through Google's SMTP servers (gsmtp).

**Tools:** Burp Suite

**Steps to reproduce:**

- Navigate to the password reset feature or intercept requests to /user/reset-password/request.
- Submit a payload containing a known valid email address and observe the successful response.
- Submit a payload containing an invalid email address with a length greater than 2 characters (e.g., fake-user123@example.com).
- Submit a payload containing a string of 2 characters or fewer (e.g., a).
- Compare the server's responses across the three scenarios, noting the verbose stack trace in the final payload's response.

**Evidence:**

- **Scripts:** "manual_security/Scripts/ENUM_INFO_LEAK_PASS_RESET_001/"
- **Results:** "manual_security/Results/ENUM_INFO_LEAK_PASS_RESET_001/"

---

### Lack of Rate Limiting on Password Reset Enables Email Bombing

**Bug ID:** RATE_LIMIT_PASS_RESET_001
**Category:** Security
**Severity:** Medium
**Priority:** Medium

**Description:** The /user/reset-password/request endpoint does not implement rate limiting or anti-automation controls (such as CAPTCHA). An attacker can abuse this endpoint by rapidly and continuously submitting POST requests with a valid user's email address. This causes the application to aggressively dispatch password reset emails to the victim. This flaw allows for email bombing (a form of targeted harassment and Denial of Service against the user's inbox) and can severely degrade the application's domain reputation with major email service providers, potentially causing legitimate application emails to be flagged as spam.

**Tools:** Burp Suite

**Steps to reproduce:**

- Identify a valid user email address registered to the application.
- Intercept the password reset POST request to /user/reset-password/request.
- Send the intercepted request to an automated testing tool like Burp Suite Intruder.
- Configure the tool to send a high volume of identical requests (e.g., 50 requests in a few seconds) targeting the victim's email.
- Monitor the server's HTTP responses and the victim's email inbox.

**Evidence:**

- **Scripts:** "manual_security/Scripts/RATE_LIMIT_PASS_RESET_001/"
- **Results:** "manual_security/Results/RATE_LIMIT_PASS_RESET_001/"

---

### Weak Password Policy Enforcement on Password Reset Execution

**Bug ID:** BROKEN_AUTH_PASS_RESET_001
**Category:** Security
**Severity:** High
**Priority:** High

**Description:** The password reset execution endpoint (PUT /user-management/user/reset-password/request) fails to enforce industry-standard password complexity and length requirements. The backend validation only checks that the password string is 3 characters or longer. By bypassing frontend validation, an attacker or user can set an extremely weak password during the reset flow. This critical lack of server-side enforcement leaves accounts highly vulnerable to brute-force, credential stuffing, and dictionary attacks.

**Tools:** Burp Suite

**Steps to reproduce:**

- Intercept the password reset PUT request using a web proxy.
- Ensure you have a valid token and uuid for the target account.
- Modify the password field in the JSON payload to a simple 3-character string (e.g., "aaa").
- Send the request to the server.

**Evidence:**

- **Scripts:** "manual_security/Scripts/BROKEN_AUTH_PASS_RESET_001/"
- **Results:** "manual_security/Results/BROKEN_AUTH_PASS_RESET_001/"

---

### Information Disclosure via Improper Error Handling on Password Reset Endpoint

**Bug ID:** INFO_LEAK_ERROR_HANDLING_002
**Category:** Security
**Severity:** Medium
**Priority:** Medium

**Description:** Fuzzing the PUT /user-management/user/reset-password/request endpoint with malformed payloads, mismatched relational data, and missing fields causes the backend to fail ungracefully. Instead of returning standardized API errors, the server responds with HTTP 400 and HTTP 500 status codes that leak internal Java errors. Notably, submitting a valid token for User A alongside the UUID of User B causes a server crash, indicating improper handling of database relational checks. These verbose errors provide attackers with unnecessary insight into the backend architecture and data models.

**Tools:** Burp Suite

**Steps to reproduce:**

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

### Persistent Account Takeover via Mass Assignment of Password Reset Tokens

**Bug ID:** ATO_MASS_ASSIGN_001
**Category:** Security
**Severity:** Critical
**Priority:** Critical

**Description:** The user registration/update endpoint (POST /user-management/user) is vulnerable to Mass Assignment. Attackers can arbitrarily modify internal security fields that should be read-only or system-controlled. By injecting the passResetCode and passResetIssuedDate fields into the JSON payload alongside a target user's UUID, an attacker can overwrite the victim's password reset token. By setting the issued date far into the future (e.g., the year 2099), the attacker creates a persistent backdoor. They can then use this injected token at any time to take over the account via the standard password reset execution endpoint, without altering the user's current password immediately or alerting them.

**Tools:** Burp Suite

**Steps to reproduce:**

- Obtain the id (UUID) of a target user.
- Intercept a POST request to /user-management/user.
- Construct a JSON payload injecting the victim's UUID, a custom passResetCode (e.g., "permanent_code"), and a future passResetIssuedDate (e.g., "2099-05-27T20:55:18.948+00:00").
- Send the request.
- Navigate to the password reset execution endpoint and submit the injected token to successfully change the victim's password.

**Evidence:**

- **Scripts:** "manual_security/Scripts/ATO_MASS_ASSIGN_001/"
- **Results:** "manual_security/Results/ATO_MASS_ASSIGN_001/"

---

### Complete Account Takeover via IDOR and Password Reset Token Theft

**Bug ID:** ATO_TOKEN_THEFT_001
**Category:** Security
**Severity:** Critical
**Priority:** Critical

**Description:** This vulnerability chains the Password Reset feature with the previously discovered Insecure Direct Object Reference (IDOR) on the /user-management/user endpoint. Because the IDOR leaks the complete user object—including the currently active passResetCode—an attacker can entirely bypass the email verification requirement of the password reset flow. An attacker can forcefully trigger a password reset for a victim, use the IDOR to extract the newly generated token from the backend, and execute the password change immediately. Alternatively, the attacker can passively monitor a victim's profile via the IDOR and hijack the account whenever the legitimate user requests a password reset.

**Tools:** Burp Suite

**Steps to reproduce:**

- Identify a victim's email address and UUID.
- Send a POST request to /user/reset-password/request with the victim's email to trigger the generation of a new reset token.
- Exploit the IDOR by sending a GET request to /user-management/user using the victim's UUID.
- Review the JSON response body and extract the newly generated value from the passResetCode field.
- Send a PUT request to the password reset execution endpoint using the stolen token and the victim's UUID to set a new password.
- Log in to the victim's account.

**Evidence:**

- **Scripts:** "manual_security/Scripts/ATO_TOKEN_THEFT_001/"
- **Results:** "manual_security/Results/ATO_TOKEN_THEFT_001/"
