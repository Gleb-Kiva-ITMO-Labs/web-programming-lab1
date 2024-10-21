package utils.models;

import utils.CONSTS;
import utils.exceptions.InvalidParameterException;

import java.util.Arrays;

public class Shape {
    private final float radius;

    public Shape(float radius) throws InvalidParameterException {
        if (Arrays.stream(CONSTS.R_VALUES).noneMatch(allowedR -> allowedR == radius)) {
            throw new InvalidParameterException(String.format("Invalid shape radius, only values from %s are allowed", Arrays.toString(CONSTS.R_VALUES)));
        }
        this.radius = radius;
    }

    public boolean containsPoint(Point point) {
        if (point.x() >= 0 && point.y() >= 0) {
            // Top right sector
            return false;
        } else if (point.x() >= 0 && point.y() < 0) {
            // Bottom right sector
            return point.y() >= point.x() - radius / 2;
        } else if (point.x() < 0 && point.y() >= 0) {
            // Top left sector
            return point.y() <= Math.sqrt(Math.pow(radius / 2, 2) - Math.pow(point.x(), 2));
        } else {
            // Bottom left sector
            return point.x() >= -radius / 2 && point.y() >= -radius;
        }
    }

}

