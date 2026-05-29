# Expected Result

The backend must independently enforce a strict password policy. The server should require a minimum length (e.g., 8+ characters) and complexity (a mix of uppercase, lowercase, numbers, and special characters). If a submitted password fails these criteria, the server should reject the request with an HTTP 400 Bad Request and a standard JSON error message indicating the password policy requirements.

# Actual Result

The backend successfully processes the password reset request and updates the user's password to the 3-character string, returning a 200 OK success status.

# Proof

You can visualize the before and after images that shows how the user's password hash changes after the payload request was sent 