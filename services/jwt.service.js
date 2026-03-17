import env from "../config/env.js";
import jwt from "jsonwebtoken";
import { UnauthorizedError, ValidationError } from "../utils/errors.js";

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.JWT_SECRET_KEY);
  } catch {
    throw new UnauthorizedError("Invalid credentials");
  }
};

export const validateToken = (payload, schema) => {
  const { success, data } = schema.safeParse(payload);
  if (!success) {
    throw new ValidationError("invalid token data");
  }
  return data;
};

export const generateToken = (payload) => {
  // @ts-ignore because expiresIn expects number | ms.StringValue | undefined
  // but we have it as a plain string in env
  const token = jwt.sign(payload, env.JWT_SECRET_KEY, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
  return token;
};
