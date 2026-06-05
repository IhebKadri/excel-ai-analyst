import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { logger } from "../utils/logger";

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  logger.error("Unhandled error", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
}
