import com.fastcgi.FCGIInterface;
import utils.ParamsParser;
import utils.ResponseGenerator;
import utils.enums.ResponseCode;
import utils.models.Point;
import utils.models.Shape;

import java.io.IOException;
import java.util.HashMap;

public class App {
    public static void main(String[] args) {
        FCGIInterface fcgi = new FCGIInterface();
        while (fcgi.FCGIaccept() >= 0) {
            String httpResponse;
            try {
                httpResponse = ResponseGenerator.get(ResponseCode.OK, processRequest());
            } catch (IOException e) {
                httpResponse = ResponseGenerator.get(ResponseCode.ERROR, e.getMessage());
            }
            System.out.println(httpResponse);
        }
    }

    private static String processRequest() throws IOException {
        String paramsString = System.getProperties().getProperty("QUERY_STRING");
        HashMap<String, String> params = ParamsParser.parse(paramsString);
        Point point = new Point(
                Integer.parseInt(params.get("x")),
                Integer.parseInt(params.get("y"))
        );
        Shape shape = new Shape(Integer.parseInt(params.get("r")));
        return String.valueOf(shape.containsPoint(point));
    }

}