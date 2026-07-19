import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import { config } from "../config";
import { AuthUser } from "../types/express";

/**
 * Verifies the Bearer token in the Authorization header and attaches the
 * decoded user to `req.user`. Must run before any `restrictTo` guard.
 */
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Authentication required", 401));
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(new AppError("Authentication required", 401));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload &
      AuthUser;

    req.user = {
      id: String(decoded.id),
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
};

/**
 * Allows the request to proceed only if `req.user.role` is in `roles`.
 * Assumes `verifyToken` has already run.
 */
export const restrictTo = (...roles: Array<"admin" | "staff">) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403),
      );
    }
    next();
  };
};
