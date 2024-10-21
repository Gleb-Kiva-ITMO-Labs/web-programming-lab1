package utils;

import utils.enums.ResponseCode;

import java.nio.charset.StandardCharsets;

public class ResponseGenerator {
    public static String get(ResponseCode responseCode, String content) {
        return String.format("""    
                        Status: %s
                        Content-Type: application/json
                        Content-Length: %d

                        %s""",
                responseCode.toString(),
                content.getBytes(StandardCharsets.UTF_8).length,
                content);
    }

    public static String get(ResponseCode responseCode) {
        return get(responseCode, "");
    }
}
