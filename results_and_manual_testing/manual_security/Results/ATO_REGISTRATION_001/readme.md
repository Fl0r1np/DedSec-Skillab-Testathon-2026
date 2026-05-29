# Environment
Targeted User UUID: a4ce79d4-2f16-4cac-a29b-b6293c865317

# Expected Result
The registration endpoint (POST) must strictly reject or ignore any client-supplied id parameter during account creation. The server should independently generate a unique UUID for all new registrations. If an id is provided in a POST request, the server should return an HTTP 400 Bad Request. Additionally, any endpoint capable of updating existing user credentials must require a valid, authenticated session matching the target user, and ideally require the user's current password before allowing modifications to sensitive fields like email or password.

# Actual Result
The server accepts the id parameter and converts the creation request into an update operation. It overwrites the victim's email and password with the attacker-supplied values without any authorization checks. The server responds with a success status and returns the victim's updated user information profile. The attacker can now log in to the victim's account using the newly set email and password.
