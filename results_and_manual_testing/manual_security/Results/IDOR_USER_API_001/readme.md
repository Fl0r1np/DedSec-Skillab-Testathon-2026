# Environment

Authenticated User JWT: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhIiwicm9sZXMiOlsiU0lNUExFIl0sImluc3RhbGxhdGlvbiI6ImNpdGl6ZW4iLCJvcmdhbml6YXRpb24iOiIiLCJpc3MiOiJodHRwOi8vcG9ydGFsLnNraWxsYWItcHJvamVjdC5ldS9sb2dpbiIsIm5hbWUiOiJhIiwiaWQiOiJjOTlmZjI5NC1lZTkyLTQyZGUtOGE0NS1hOTg2MGFjZTMyY2QiLCJleHAiOjE3Nzk4OTc0MTF9.D5wZ-eTkUvPZBAhkkwv8UkH-ZHgXLzXw5r1JDiSpY8Q

Authenticated User UUID: c99ff294-ee92-42de-8a45-a9860ace32cd

Targeted User UUID: a4ce79d4-2f16-4cac-a29b-b6293c865317

# Expected Result

The server must implement strict server-side access controls to validate the authorization context of the requesting user. When a user attempts to access an ID that does not belong to their authenticated session, the server should reject the request with an HTTP 403 Forbidden (or HTTP 404 Not Found to prevent enumeration). The response body must not disclose any user data.


# Actual Result
The server processes the request without validating authorization and responds with an HTTP 200 OK status. The response body leaks the targeted user's complete sensitive data profile, including their password hash and passResetCode.
