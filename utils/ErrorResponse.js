class ErrorResponse extends Error {
    constructor(message, statusCode, status = null) {
        super(message)
        if (status != null) {
            this.status = status;
        }
        this.message = message
        this.statusCode = statusCode;
    }
}

module.exports = ErrorResponse;