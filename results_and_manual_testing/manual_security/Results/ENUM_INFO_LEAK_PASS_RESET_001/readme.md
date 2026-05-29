# Expected Result

The endpoint must completely mask the existence or non-existence of user accounts to prevent enumeration. Regardless of whether the email exists, the server should return a generic, standardized response (e.g., HTTP 200 OK with a message stating: "If that email address is in our system, we have sent a password reset link."). Furthermore, the application must implement a global exception handler. Invalid inputs must be caught securely and return a standardized HTTP 400 Bad Request without disclosing underlying Java exceptions, variable names, or third-party infrastructure details.

# Actual Result

The server returns completely different responses based on the backend state and input length:

Valid Email: Processes the request and sends the email without error.

Invalid Email (> 2 chars): Returns an HTTP 404 Not Found with a verbose JSON error message confirming the email's absence: {"status":404, "message":"User with email [x] doesn't exist!"}.

Single Character Input: Fails to validate the input gracefully, resulting in an HTTP 500 Internal Server Error. The response body discloses backend stack traces and infrastructure details, specifically javax.mail.SendFailedException and Google SMTP provider logs.