import type { Request, Response, NextFunction } from "express";
import { verifyUserToken } from "../utils/jwt.js";
import ApiError from "../utils/api.error.js";
export function optionalAuthenticationMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    // No token → anonymous user
    if (!token) {
      return next();
    }

    // Token exists → verify it
    const decoded = verifyUserToken(token);

    // Invalid token
    if (!decoded) {
      return next(); // or reject if you want
    }

    // @ts-ignore
    req.user = decoded;

    next();
  };
}
