import { NextFunction, Request, Response } from "express";
import { APIError } from "../helpers/apiError";

export const errorMiddleware = (
  err: Error & Partial<APIError>,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode ?? 400;
  const message = err?.message;

  try {
    res.status(statusCode).json({ message: JSON.parse(message) });
  } catch (err) {
    res.status(statusCode).json({ message });
  }
};
