import { AppError, ValidationError } from "../utils/errors.js";

export const globalErrorHandler = (err, req, res, next) => {
  console.error(err.message);
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      // wierd syntax but it only adds the errors property if the error is a ValidationError
      ...(err instanceof ValidationError && { errors: err.errors }),
      code: err.code,
      stack: err.stack,
    });
  }
  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
    stack: err.stack,
  });
};

/**
 * 
 * @param {import("express").Handler} fn 
 */
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
