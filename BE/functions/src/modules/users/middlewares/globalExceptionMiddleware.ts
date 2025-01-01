import { Request, Response, NextFunction } from "express";
import { StatusCode } from "../../../enums/StatusCode";

import { ApiError, ApiResponse } from "../models/ApiResponse";

export const GlobalExceptionMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  const statusCode = (err instanceof ApiError ? err.statusCode : 500) || 500;
  const errorMessage = err.message || "Internal Server Error";

  const response = new ApiResponse<null>(
    null, // Không có data trả về khi có lỗi
    false, // Thành công là false vì có lỗi
    errorMessage, // Thông điệp lỗi
    statusCode as StatusCode // Mã trạng thái HTTP
  );
  res.status(statusCode).json(response);
};
