export class ApiError extends Error {
  constructor(message, statusCode, errors = [], stack = "") {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.message = message;
    this.data = null;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
