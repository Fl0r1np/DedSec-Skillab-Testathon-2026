# Expected Result

The server must enforce strict rate limiting on the password reset endpoint. Common protections include limiting reset requests to a maximum of 3-5 per hour per user account, implementing IP-based rate limiting, or requiring a CAPTCHA verification before processing the request to block automated abuse.

# Actual Result

The server processes an unlimited number of password reset requests from the same IP address/targeting the same user without enforcing any cooldown periods or blocks. The victim's inbox is flooded with reset emails.
