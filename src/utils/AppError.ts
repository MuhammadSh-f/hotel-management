export class AppError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;

    //Maintain proper stack trace for where our error was thrown (
    Error.captureStackTrace(this, this.constructor);
  }
}
