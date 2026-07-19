import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

const formatZodErrors = (error: any) => {
  const formatted: Record<string, string> = {};

  error.issues.forEach((err: any) => {
    const field = err.path.join(".");
    formatted[field] = err.message;
  });

  return formatted;
};

export const validateRequest =
  <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const parsedData = schema.safeParse(req.body);

    if (!parsedData.success) {
      const errors = formatZodErrors(parsedData.error);

      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    req.body = parsedData.data;
    next();
  };
