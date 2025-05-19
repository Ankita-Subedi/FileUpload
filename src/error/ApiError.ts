export class ApiError extends Error {
  success: boolean;
  constructor(
    public message: string,
    public statusCode: number
  ) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
    this.success = false;
  }
}
