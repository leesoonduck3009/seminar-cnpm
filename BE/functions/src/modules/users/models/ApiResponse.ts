import { StatusCode } from "../enums/StatusCode";

export class ApiResponse<T> {
  data: T | null; // Dữ liệu trả về, có thể là null nếu có lỗi
  isSuccess: boolean; // Biến xác định phản hồi có thành công hay không
  errorMessage: string | null; // Thông điệp lỗi, null nếu không có lỗi
  statusCode: StatusCode; // Mã trạng thái HTTP
  constructor(
    data: T | null,
    isSuccess: boolean,
    errorMessage: string | null,
    statusCode: StatusCode
  ) {
    this.data = data;
    this.isSuccess = isSuccess;
    this.errorMessage = errorMessage;
    this.statusCode = statusCode;
  }
}
export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class ConflictError extends ApiError {
  constructor(message = "Conflict occurred") {
    super(message, 409);
  }
}

export class AuthorizeError extends ApiError {
  constructor(message = "Authorization required") {
    super(message, 401);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class InvalidModelError extends ApiError {
  constructor(message = "Invalid model data") {
    super(message, 400);
  }
}

export class UnauthorizeError extends ApiError {
  constructor(message = "Unauthorize error") {
    super(message, 403);
  }
}
