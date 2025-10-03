import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "@shared/types/api";

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("Error:", error);

  const response: ApiResponse = {
    success: false,
    error: error.message || "Internal server error",
    timestamp: new Date().toISOString(),
  };

  res.status(500).json(response);
};
