import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ApiError } from "../utils/api-error";

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(404, "Route not found"));
}

export function errorHandler(error: any, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof mongoose.Error.ValidationError) return res.status(422).json({ success: false, message: "Validation failed", errors: error.errors });
  if (error?.code === 11000) return res.status(409).json({ success: false, message: "A record with this information already exists" });
  const status = error instanceof ApiError ? error.statusCode : 500;
  res.status(status).json({ success: false, message: status === 500 ? "An unexpected server error occurred" : error.message, ...(error instanceof ApiError && error.details ? { errors: error.details } : {}) });
}
