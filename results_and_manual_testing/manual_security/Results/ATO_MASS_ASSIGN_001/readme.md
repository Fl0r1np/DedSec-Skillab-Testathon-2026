# Expected Result

The backend must strictly define which fields are allowed to be modified by the client (an allowlist). Security-sensitive fields such as passResetCode, passResetIssuedDate, and roles must never be bindable or updatable via user-supplied input on the registration/profile endpoints. The server should ignore these fields or reject the request with an HTTP 400 Bad Request.

# Actual Result

The backend database accepts and stores the attacker-supplied passResetCode and passResetIssuedDate without validation. The attacker successfully establishes a permanent reset token that can be used to compromise the account at their discretion.

You can see the process by looking at the result images from this directory