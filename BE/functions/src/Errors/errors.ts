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
