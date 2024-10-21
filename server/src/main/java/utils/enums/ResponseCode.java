package utils.enums;

public enum ResponseCode {
    OK(200, "OK"),
    ERROR(400, "Bad request"),
    SERVER_ERROR(402, "Server error");

    private final int code;
    private final String message;

    ResponseCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    @Override
    public String toString() {
        return String.format("%d %s", code, message);
    }
}
