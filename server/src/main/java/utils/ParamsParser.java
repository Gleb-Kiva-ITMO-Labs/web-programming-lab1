package utils;

import java.util.HashMap;

public class ParamsParser {
    public static HashMap<String, String> parse(String paramsString) {
        HashMap<String, String> params = new HashMap<>();
        for (String paramString : paramsString.split("&")) {
            String[] param = paramString.split("=");
            params.put(param[0], (param.length > 1) ? param[1] : "");
        }
        return params;
    }
}
