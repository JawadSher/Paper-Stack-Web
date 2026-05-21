export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const Errors = {
  NOT_FOUND: (entity: string) =>
    new AppError(`${entity} not found`, "NOT_FOUND", 404),
  UNAUTHORIZED: () => new AppError("Unauthorized", "UNAUTHORIZED", 401),
  DUPLICATE: (entity: string) =>
    new AppError(`${entity} already exists`, "DUPLICATE", 409),
  VALIDATION: (msg: string) => new AppError(msg, "VALIDATION", 400),
  UPLOAD_FAILED: () => new AppError("File upload failed", "UPLOAD_FAILED", 500),
  DB_ERROR: (msg: string) =>
    new AppError(`Database error: ${msg}`, "DB_ERROR", 500),
} as const;
