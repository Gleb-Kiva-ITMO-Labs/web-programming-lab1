package utils.models;


import utils.CONSTS;
import utils.exceptions.InvalidParameterException;

public record Point(int x, int y) {
    /**
     * @throws InvalidParameterException
     */
    public Point(int x, int y) {
        this.x = x;
        this.y = y;
        if (!(CONSTS.MIN_X <= x && x <= CONSTS.MAX_X))
            throw new InvalidParameterException(
                    String.format("X should be between %d and %d",
                            CONSTS.MIN_X,
                            CONSTS.MAX_X));
        if (!(CONSTS.MIN_Y <= y && y <= CONSTS.MAX_Y))
            throw new InvalidParameterException(
                    String.format("Y should be between %d and %d",
                            CONSTS.MIN_Y,
                            CONSTS.MAX_Y));
    }
}
