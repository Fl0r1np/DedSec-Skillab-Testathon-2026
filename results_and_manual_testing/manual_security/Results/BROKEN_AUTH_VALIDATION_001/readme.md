# Expected Result
The backend API must independently validate all incoming data and never trust client-side validation. The server should strictly enforce:
Password Policy: Minimum length (e.g., 8+ characters) and complexity requirements.
Email Validation: A standard regex check to ensure the input is a structurally valid email address.
Length Restrictions: Minimum and maximum character limits for usernames.
Required Fields: Rejection of any empty strings ("") or null values for mandatory fields.

Any payload failing these checks must be rejected outright with an HTTP 400 Bad Request and a descriptive error message indicating which validation rule failed.

# Actual Result
The backend successfully processes the request and creates a new user account despite the inputs being functionally invalid or completely empty. The server responds with a success status code (e.g., 200 OK or 201 Created) and the application applies no password strength policies, length restrictions, or standard email regex validations.