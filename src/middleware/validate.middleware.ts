import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../utils/api-error";

export const validate = (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  if (!result.success) return next(new ApiError(422, "Please check the submitted information", result.error.flatten().fieldErrors));
  req.body = result.data;
  next();
};
