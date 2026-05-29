# Expected Response

The application must implement a global exception handler. All payload validation failures, database mapping mismatches, and malformed requests must be caught securely. The server should return generic, standardized JSON error messages (e.g., {"error": "Invalid request parameters", "status": 400}) without disclosing any underlying stack traces, Java exceptions, or infrastructure details.

# Actual Response

The backend fails to catch exceptions safely, resulting in HTTP 400 and 500 status codes. The response bodies contain unhandled Java exceptions and internal server errors, explicitly revealing backend parsing and logic failures.


# Response Examples

|HTTP Method & Endpoint|Fuzzing Payload / Action|HTTP Status|Sensitive Data Leaked in Response|
|----------------------|------------------------|-----------|---------------------------------|
|PUT /user-management/user/reset-password|{"password":"a","token":"[VALID TOKEN OF USER B]","uuid":"[VALID UUID OF USER A]"}|500 Internal Server Error|"No message available"|
|PUT /user-management/user/reset-password|{"password":"aaa","token":null,"uuid":"41289887-c0af-4a29-af22-02b478c2eaf4“}|500 Internal Server Error|"No message available"|
|PUT /user-management/user/reset-password|{"password":"a","uuid":"41289887-c0af-4a29-af22-02b478c2eaf4"}|500 Internal Server Error|"No message available"|
|PUT /user-management/user/reset-password|{"password":"a","token":null}|500 Internal Server Error|"The given id must not be null!; nested exception is java.lang.IllegalArgumentException: The given id must not be null!"|
|PUT /user-management/user/reset-password|{"uuid":"-1"}|400 Bad Request|"JSON parse error: Cannot deserialize value of type `java.util.UUID` from String \"-1\": UUID has to be represented by standard 36-char representation; nested exception is com.fasterxml.jackson.databind.exc.InvalidFormatException: Cannot deserialize value of type `java.util.UUID` from String \"-1\": UUID has to be represented by standard 36-char representation\n at [Source: (org.springframework.util.StreamUtils$NonClosingInputStream); line: 1, column: 9] (through reference chain: gr.uom.user_management.controllers.dto.ResetPasswordRequest[\"uuid\"])"|
|PUT /user-management/user/reset-password|{"password":"a","token":{"value":"null"},"uuid":"41289887-c0af-4a29-af22-02b478c2eaf4"}|400 Bad Request|"JSON parse error: Cannot deserialize value of type `java.lang.String` from Object value (token `JsonToken.START_OBJECT`); nested exception is com.fasterxml.jackson.databind.exc.MismatchedInputException: Cannot deserialize value of type `java.lang.String` from Object value (token `JsonToken.START_OBJECT`)\n at [Source: (org.springframework.util.StreamUtils$NonClosingInputStream); line: 1, column: 25] (through reference chain: gr.uom.user_management.controllers.dto.ResetPasswordRequest[\"token\"])"|

