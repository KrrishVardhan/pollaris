class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  constructor(statusCode: number, message: string) {
    // calling parent class constructor using message as argument
    super(message);
    // adding custom property for status code

    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad request") {
    throw new ApiError(400, message);
  }
  static unAuthorized(message = "Unauthorized") {
    throw new ApiError(401, message);
  }
  static conflict(message = "Conflict") {
    throw new ApiError(409, message);
  }
  static forbidden(message = "Forbidden") {
    throw new ApiError(412, message);
  }
  static notfound(message = "Notfound") {
    throw new ApiError(412, message);
  }
}

export default ApiError;
