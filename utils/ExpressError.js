class ExpressError extends Error {
    constructor(statusCode, message) {
        super(message); // Call the parent class (Error) constructor
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;