import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ApiError } from "../error/ApiError";
import { config } from "../config/env.config";

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(config.NODE_ENV === "development" ? { stack_trace: err.stack } : {}),
    });
  }

  res.status(500).json({
    success: false,
    message: err.message,
    ...(config.NODE_ENV === "development" ? { stack_trace: err.stack } : {}),
  });
};
