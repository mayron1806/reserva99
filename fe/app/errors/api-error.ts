export class ApiError extends Error {
  constructor(message?: string, public readonly status?: number, cause?: Error) {
    super(message, { cause });
  }
}