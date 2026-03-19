const ERROR_CODES = {
  INTERNAL_ERROR: "INTERNAL_ERROR",
  NOT_FOUND: "NOT_FOUND",
  BAD_REQUEST: "BAD_REQUEST",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  CONFLICT: "CONFLICT",
};


class AppError extends Error {
  /**
   * 
   * @param {number} statusCode 
   * @param {keyof typeof ERROR_CODES} code 
   * @param {string} message 
   * @param {Array} errors 
   */
  constructor(statusCode, code, message, errors) {
    super(message);
    this.statusCode = statusCode;
    this.status = "error";
    this.code = code;
    this.message = message;
    this.errors = errors;
  }
}

class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(404, ERROR_CODES.NOT_FOUND, message);
  }
}


class BadRequestError extends AppError {
  constructor(message = "Bad request", errors) {
    super(400, ERROR_CODES.BAD_REQUEST, message, errors);
  }
}

class ValidationError extends AppError {
  constructor(message = "Validation error", zodIssues) {
    super(422, ERROR_CODES.VALIDATION_ERROR, message, zodIssues);
    this.errors = zodIssues?.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`,
    );
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(401, ERROR_CODES.UNAUTHORIZED, message);
  }
}

class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(403, ERROR_CODES.FORBIDDEN, message);
  }
}

class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(409, ERROR_CODES.CONFLICT, message);
  }
}

class InternalError extends AppError {
  constructor(message = "Internal server error") {
    super(500, ERROR_CODES.INTERNAL_ERROR, message);
  }
}
export {
  AppError,
  NotFoundError,
  BadRequestError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  InternalError,
};
