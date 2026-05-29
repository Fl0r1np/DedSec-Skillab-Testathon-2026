# Expected Result

As noted in previous reports, the IDOR must be patched so users cannot read other profiles. Furthermore, the passResetCode and passResetIssuedDate are highly sensitive internal authentication secrets and must never be serialized or returned in any API response to the client frontend, even for the legitimate user viewing their own profile.

# Actual Result

The attacker successfully bypasses the email delivery mechanism by reading the passResetCode directly from the API response via the IDOR vulnerability, allowing for immediate and unauthenticated Account Takeover.
