### Login form allows unlimited character input, causing page freeze

**Bug ID:** LOGIN_001 

**Category:** UI/UX

**Title:** Login form allows unlimited character input, causing page freeze

**Severity:** Medium

**Priority:** Medium

**Description:** On the public website login page (https://portal.skilllab-project.eu/login), the email and password fields lack character limits. Inputting an excessively large volume of characters eventually blocks the page on the user side.

**Tools:** Brave Browser (Version 1.90.124)

**Steps to reproduce:**
- Open the Skilllab public platform (https://portal.skilllab-project.eu/login).
- Paste a very large string of characters (e.g. 50,000+ characters) into the Email or Password field.
- Continue entering characters until the browser tab becomes unresponsive.

**Evidence:**
- Images: manual_results/LOGIN_001_2.png
- Video: manual_results/LOGIN_001_1.mp4

---

### Register form allows unlimited character input, causing page freeze, and the form to break

**Bug ID:** REGISTER_001

**Category:** UI/UX

**Title:** Register form allows unlimited character input, causing page freeze, and the form to break

**Severity:** Medium

**Priority:** Medium

**Description:** On the public website register page (https://portal.skillab-project.eu/register), the fields lack character limits. Inputting an excessively large volume of characters eventually blocks the page on the user side.

**Tools:** Brave Browser (Version 1.90.124)

**Steps to reproduce:**
- Open the Skilllab public platform and press register (https://portal.skillab-project.eu/register).
- Paste a very large string of characters (e.g. 50,000+ characters) into the Email or Password field.
- Continue entering characters until the browser tab becomes unresponsive.

**Evidence:**
- Images: manual_results/REGISTER_001_1.png
- Video: manual_results/REGISTER_001_2.mp4

---

### Register form lacks password policy validation (length and complexity)

**Bug ID:** REGISTER_002

**Category:** Security

**Title:** Register form lacks password policy validation (length and complexity)

**Severity:** High

**Priority:** High

**Description:** On the public website register page (https://portal.skilllab-project.eu/register), the system does not enforce any password security policy. A user can register using a password of any length (even 1 character) and any format (e.g., no uppercase letters, numbers, or special characters are required).

**Tools:** Brave Browser (Version 1.90.124)

**Steps to reproduce:**
- Open the Skilllab public platform registration page. (https://portal.skillab-project.eu/register).
- Fill in the fields
- Enter a very weak password (e.g., "a" or "123")
- Click Register

**Evidence:**
- Video: manual_results/REGISTER_002_1.mp4

---

### Failed login attempt returns HTTP 403 Forbidden instead of 401 Unauthorized

**Bug ID:** LOGIN_002

**Category:** Integration

**Title:** Failed login attempt returns HTTP 403 Forbidden instead of 401 Unauthorized

**Severity:** Low

**Priority:** Low

**Description:** When attempting to log in to the portal (https://portal.skilllab-project.eu/login) with invalid credentials, the server returns an HTTP 403 Forbidden status code. According to HTTP protocol standards, a failed authentication attempt due to incorrect credentials should return 401 Unauthorized. The current behavior suggests a misconfiguration in the authentication/authorization middleware on the backend.

**Tools:** Brave Browser (Version 1.90.124)

**Steps to reproduce:**
- Navigate to the login page: https://portal.skilllab-project.eu/login.
- Open the browser's Developer Tools (F12) and switch to the Network tab.
- Enter an incorrect password or email in the login fields.
- Click the Login button.
- Locate the network request (usually named login or auth) in the list and inspect the Status Code.

**Evidence:**
- Video: manual_results/LOGIN_002_1.mp4

---

### "Forgot Password" feature is vulnerable to user enumeration

**Bug ID:** FORGOT_PW_001

**Category:** Security

**Title:** "Forgot Password" feature is vulnerable to user enumeration

**Severity:** Medium

**Priority:** Medium

**Description:** The "Forgot Password" feature is vulnerable to user enumeration. When an invalid or non-existent email address is entered, the system explicitly returns the error message: "User with email [email] doesn't exist!". This allows unauthorized users to verify whether specific email addresses are registered in the system.

**Tools:** Brave Browser (Version 1.90.124)

**Steps to reproduce:**
- Navigate to the "Forgot Password" page (https://portal.skilllab-project.eu/forgot-password).
- Enter an email address that is definitely not registered in the system (e.g., random.test.email.123@example.com).
- Click the "SEND PASSWORD RESET LINK" button.
- Observe the error message displayed.

**Evidence:**
- Video: manual_results/ FORGOT_PW_001_1.mp4

---

### Login form accepts empty/blank credentials

**Bug ID:** LOGIN_003

**Category:** Functional

**Title:** Login form accepts empty/blank credentials

**Severity:** Medium

**Priority:** Medium

**Description:** The login form does not perform proper validation for empty or blank input fields. When the "Login" button is clicked without providing an email and password, the system sends an empty request to the server.

**Tools:** Brave Browser (Version 1.90.124)

**Steps to reproduce:**
- Go to the login page: https://portal.skilllab-project.eu/login.
- Leave both the "Email" and "Password" fields empty.
- Open the Network tab in Developer Tools (F12).
- Click the "Login" button.
- Observe that the system sends an empty/blank request to the server instead of displaying validation errors.

**Evidence:**
- Video: manual_results/ LOGIN_003_1.mp4

---

### Session remains active after password change

**Bug ID:** SEC_001

**Category:** Security

**Title:** Session remains active after password change

**Severity:** High

**Priority:** High

**Description:** The application fails to invalidate existing user sessions after a password change. If a user changes their password, all active sessions on other browsers or devices should be terminated immediately. Currently, a session remains valid and allows continued access to the account even after the password has been updated.

**Tools:** Brave Browser (Version 1.90.124), Chrome Browser (Version 148.0.7778.179)

**Steps to reproduce:**
- Log in to the Skilllab portal on Browser A
- On Browser B, change the password of the account previously logged in
- Once the password change is successful, switch to Browser A.
- Perform an action (e.g., refresh the page or navigate to a restricted section) to check if the session is still active.

**Evidence:**
- Video: manual_results/ SEC_001_1.mp4

---

### Error for invalid search and loading state persists indefinitely after failed search validation

**Bug ID:** SEARCH_001

**Category:** Functional

**Title:** Error for invalid search and loading state persists indefinitely after failed search validation

**Severity:** Medium

**Priority:** Medium

**Description:** When clicking "Apply" on the [Demand/Analytics/Biodiversity] search filter without selecting any option, an error is triggered. After closing the error notification, the UI remains stuck in a "Loading" state (loading animation persists), preventing the user from performing subsequent searches or interacting with the page.

**Tools:** Brave Browser (Version 1.90.124)

**Steps to reproduce:**
- Navigate from the main page to Demand/Analytics/Biodiversity or select Biodiversity on https://portal.skillab-project.eu/citizen/demand-analytics
- Enter random a text that is not in the list, in the field
- Click the "Apply" button.
- Observe the error message triggered by the system.
- Close the error message/notification.
- Observe the UI state (loading animation).

**Evidence:**
- Video: manual_results/SEARCH_001_1.mp4

---

### Search request hangs in "Pending" state when entering invalid keywords

**Bug ID:** SEARCH_002

**Category:** Integration

**Title:** Search request hangs in "Pending" state when entering invalid keywords

**Severity:** Medium

**Priority:** Medium

**Description:** The apply analysis functionality in the Supply/Analytics/Turf (https://portal.skillab-project.eu/citizen/supply-analytics  turf section) section fails to handle invalid user input. When a user inputs arbitrary text that does not match any of the provided filter options and clicks "Apply Analysis", the application sends a request that remains stuck in a "Pending" state indefinitely.

**Tools:** Brave Browser (Version 1.90.124)

**Steps to reproduce:**
- Open the Network tab in Developer Tools (F12)
- Navigate to the Supply/Analytics/Turf section (https://portal.skillab-project.eu/citizen/supply-analytics  turf section).
- In the keywords field, enter a random string that is not among the suggested options.
- Click the "Apply Analysis" button.
- Monitor the request in the Network tab.

**Evidence:**
- Video: manual_results/SEARCH_002_1.mp4

---

### Keywords field allows unlimited character input, causing page freeze

**Bug ID:** SEARCH_003

**Category:** UI/UX

**Title:** Keywords field allows unlimited character input, causing page freeze

**Severity:** Medium

**Priority:** Medium

**Description:** On the public website page, Supply/Analytics/Turf section (https://portal.skillab-project.eu/citizen/supply-analytics  turf section), the keyword field lacks character limits. Inputting an excessively large volume of characters eventually blocks the page on the user side, and breaks it.

**Tools:** Brave Browser (Version 1.90.124)

**Steps to reproduce:**
- Navigate to the Supply/Analytics/Turf section (https://portal.skillab-project.eu/citizen/supply-analytics  turf section).
- Paste a very large string of characters (e.g. 50,000+ characters) into the Keywords field.
- Continue entering characters until the browser tab becomes unresponsive.

**Evidence:**
- Video: manual_results/SEARCH_003_1.mp4

---

### Improper input handling leads to Internal Server Error (500)/Potential XSS

**Bug ID:** SEC_002

**Category:** Security

**Title:** Improper input handling leads to Internal Server Error (500)/Potential XSS

**Severity:** High

**Priority:** High

**Description:** The search input in the Supply/Analytics/Turf section does not properly sanitize or validate user input. Submitting script-like payloads (e.g., <script>alert(1)</script>) triggers an HTTP 500 Internal Server Error.

**Tools:** Brave Browser (Version 1.90.124)

**Steps to reproduce:**
- Navigate to the Supply/Analytics/Turf section (https://portal.skillab-project.eu/citizen/supply-analytics  turf section).
- Enter <script>alert(1)</script> in the Keywords field.
- Click "Apply Analysis".
- Inspect the request in the Network tab.

**Evidence:**
- Video: manual_results/SEC_002_1.mp4

---

### Keywords field from Supply/Analytics/Co-occurrence allows unlimited character input, causing page freeze

**Bug ID:** SEARCH_004

**Category:** UI/UX

**Title:** Keywords field from Supply/Analytics/Co-occurrence allows unlimited character input, causing page freeze

**Severity:** Medium

**Priority:** Medium

**Description:** On the public website page, Supply/Analytics/Co-occurrence section (https://portal.skillab-project.eu/citizen/supply-analytics  Co-occurence section), the Keywords field lacks character limits. Inputting an excessively large volume of characters eventually blocks the page on the user side, and breaks it.

**Tools:** Brave Browser (Version 1.90.124)

**Steps to reproduce:**
- Navigate to the Supply/Analytics/Co-occurrence section (https://portal.skillab-project.eu/citizen/supply-analytics  Co-occurence section)
- Paste a very large string of characters (e.g. 50,000+ characters) into the Keywords field.
- Continue entering characters until the browser tab becomes unresponsive.

**Evidence:**
- Video: manual_results/SEARCH_004_1.mp4

---

### Missing auto-login flow after successful registration

**Bug ID:** UX_001

**Category:** UI/UX

**Title:** Missing auto-login flow after successful registration

**Severity:** Low

**Priority:** Low

**Description:** After a successful registration, the user is redirected to the login page and is forced to manually enter their credentials again to access the account. This breaks the expected workflow and decreases the user experience.

**Tools:** Brave Browser (Version 1.90.124)

**Steps to reproduce:**
- Navigate to the registration page (https://portal.skillab-project.eu/register).
- Fill in all required fields with new, valid data, so that a new account can be created.
- Submit the registration form.
- Observe that the user is redirected to the login page (https://portal.skillab-project.eu/login) instead of being automatically logged in.

**Evidence:**
- Video: manual_results/UX_001_1.mp4

---

### Mobile layout breaks when accessing navigation menus

**Bug ID:** UX_002

**Category:** UI/UX

**Title:** Mobile layout breaks when accessing navigation menus

**Severity:** Low

**Priority:** Medium

**Description:** When opening the top or side navigation menus, the elements shift the entire page content to the right instead of overlaying it. This forces horizontal scrolling and makes the interface difficult to navigate on mobile devices.

**Tools:** Brave Browser (Version 1.90.124)

**Steps to reproduce:**
- Open the application in a browser.
- Login
- Open Developer Tools (F12) and toggle "Device Toolbar" (or press Ctrl+Shift+M).
- Select a mobile device resolution.
- Click on the navigation menu (top or right).
- Observe the shift in the page layout.

**Evidence:**
- Video: manual_results/UX_002_1.mp4

---

### Layout shift in "My Skills" section

**Bug ID:** DESIGN_001

**Category:** UI/UX

**Title:** Layout shift in "My Skills" section

**Severity:** Low

**Priority:** Low

**Description:** In the "My Skills" section, the appearance of the "Loading..." text during a search operation causes a visual shift (misalignment) of the surrounding form elements. The layout dynamically adjusts to accommodate the loading text.

**Tools:** Brave Browser (Version 1.90.124)

**Steps to reproduce:**
- Login
- Navigate to the "My Skills" section within the user profile.
- Start typing in the search/input field to add a new skill.
- Observe the UI when the "Loading..." indicator appears.

**Evidence:**
- Video: manual_results/DESIGN_001_1.mp4

---

### Layout misalignment in Demand and Supply, Forecasting/Ageing sections

**Bug ID:** DESIGN_002

**Category:** UI/UX

**Title:** Layout misalignment in Demand and Supply, Forecasting/Ageing sections

**Severity:** Low

**Priority:** Low

**Description:** There is a noticeable inconsistency in the alignment of form components between the "Demand/Forecasting/Ageing" and "Supply/Forecasting/Ageing" sections. The input fields and buttons are not positioned uniformly, creating a disjointed visual experience when switching between these modules.

**Tools:** Brave Browser (Version 1.90.124)

**Steps to reproduce:**
- Login
- Navigate to the Demand/Forecasting/Ageing section and to the Supply/Forecasting/Ageing section

**Evidence:**
- Image: manual_results/DESIGN_002_1.png
- manual_results/DESIGN_002_2.png

---

### Generic and misleading error message displayed instead of specific input validation error

**Bug ID:** UX_003

**Category:** UI/UX

**Title:** Generic and misleading error message displayed instead of specific input validation error

**Severity:** Low

**Priority:** Low

**Description:** When the user enters a numeric value that exceeds the maximum integer limit in the "Forecast Horizon (Months)" field, the server correctly identifies the issue and returns a descriptive JSON error (Unable to parse input string as an integer, exceeded maximum size). However, the frontend ignores this specific error and displays a generic, misleading message: "Failed to fetch forecast data. The service might be temporarily unavailable.".

**Tools:** Brave Browser (Version 1.90.124)

**Steps to reproduce:**
- Navigate to https://portal.skillab-project.eu/citizen/demand-forecasting.
- Select the "Timeseries" tab.
- In the "Forecast Horizon (Months)" field, enter a very large number (e.g., 12000000000000000000000000000000000000000).
- Click "Run Forecast".
- Observe the UI error message and simultaneously check the "Network" tab in Developer Tools for the actual server response.

**Evidence:**
- Video: manual_results/UX_003_1.mp4

---

### Layout misalignment in Deman/Analytics, Turf Analysis form

**Bug ID:** DESIGN_003

**Category:** UI/UX

**Title:** Layout misalignment in Deman/Analytics, Turf Analysis form

**Severity:** Low

**Priority:** Low

**Description:** The Turf Analysis form exhibits a visual layout inconsistency where the 'Combinations' dropdown and the 'Select Pillar' component are not vertically or horizontally aligned with the surrounding elements. This misalignment disrupts the visual hierarchy of the form, causing it to appear unpolished.

**Tools:** Brave Browser (Version 1.90.124)

**Steps to reproduce:**
- Login
- Navigate to Demand/Analytics (https://portal.skillab-project.eu/citizen/demand-analytics), to Turf tab
- Observe the misalignment in the Turf Analysis form

**Evidence:**
- Images: manual_results/DESIGN_003_1.png

---

### Layout misalignment in Supply/Analytics, Turf Analysis form

**Bug ID:** DESIGN_004

**Category:** UI/UX

**Title:** Layout misalignment in Supply/Analytics, Turf Analysis form

**Severity:** Low

**Priority:** Low

**Description:** The Turf Analysis form in the 'Supply/Analytics' module exhibits a visual layout misalignment. The input field 'Keywords', the 'Combinations' dropdown, and the 'Select Pillar' button do not share consistent horizontal or vertical alignment.

**Tools:** Brave Browser (Version 1.90.124)

**Steps to reproduce:**
- Login
- Navigate to Supply/Analytics (https://portal.skillab-project.eu/citizen/supply-analytics), to Turf tab
- Observe the misalignment in the Turf Analysis form

**Evidence:**
- Images: manual_results/DESIGN_004_1.png

---

### Unresolved placeholder text in notification dropdown

**Bug ID:** UI_001

**Category:** UI/UX

**Title:** Unresolved placeholder text in notification dropdown

**Severity:** Low

**Priority:** Low

**Description:** On the authenticated "My Account" dashboard, the notification dropdown menu in the top navigation bar contains unresolved boilerplate placeholder text. When the user clicks the bell icon, the menu displays generic items ("Action", "Another Action", "Something else here") instead of functional links or actual system notifications.

**Tools:** Web Browser

**Steps to reproduce:**
- Log in to the application and navigate to the "My Account" dashboard.
- Locate the notification bell icon in the top right corner of the global navigation bar.
- Click the bell icon to expand the dropdown menu.
- Observe that the menu items display generic placeholder text ("Action", "Another Action", "Something else here").

**Evidence:**
- Images: manual_results/UI_001_1.png

---

### BOLA in /user-management/user/ Endpoint Exposes Sensitive User Data (Password Hashes and Reset Codes)

**Bug ID:** SEC_003 

**Category:** Security - Broken Object Level Authorization (BOLA) / Insecure Direct Object Reference (IDOR)

**Title:** BOLA in /user-management/user/ Endpoint Exposes Sensitive User Data (Password Hashes and Reset Codes)

**Severity:** Critical

**Priority:** Very High (Immediate fix required)

**Description:** The application’s user management API endpoint (/user-management/user/{uuid}) fails to implement proper object-level authorization checks. An authenticated user (e.g., with the "SIMPLE" role) can supply an arbitrary UUID belonging to another user and successfully retrieve their full backend profile.
The vulnerability allows any authenticated user to retrieve the password hashes and active password reset codes of any other user on the platform, leading directly to account takeover and mass credential harvesting.
Furthermore, the API response improperly includes highly sensitive, backend-only fields that should never be exposed to the client-side. This includes the victim's bcrypt password hash, active passResetCode, and passResetIssuedDate. An attacker exploiting this can harvest password hashes for offline cracking or immediately hijack user accounts by utilizing the exposed permanent password reset codes.

**Tools:** Postman, cURL

**Steps to reproduce:**
- Log into the application with a standard, low-privileged user account to obtain a valid session token (JWT).
- Identify or enumerate the UUID of a target victim user ([UUID], e.g., 41289887-c0af-4a29-af22-02b478c2eaf4).
- Intercept or construct a GET request to the user profile endpoint: https://portal.skillab-project.eu/user-management/user/[UUID].
- Include the valid Bearer token in the Authorization header.
- Send the request.
- Observe that the server responds with a 200 OK status and returns a JSON object containing the victim's sensitive data, including the password hash and passResetCode.

**Evidence:**
- Image: manual_results/SEC_003_1.png