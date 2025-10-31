export class CacheException extends Error {
  public readonly errorCode: string;
  public readonly errorDetails: string[];
  public readonly statusCode: number;

  constructor(
    message: string,
    errorCode: string,
    errorDetails: string[] = [],
    statusCode = 500
  ) {
    super(message);
    this.name = new.target.name;
    this.errorCode = errorCode;
    this.errorDetails = errorDetails;
    this.statusCode = statusCode;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
