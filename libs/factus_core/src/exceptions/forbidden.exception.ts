import { ApplicationException } from './application.exception';

export class ForbiddenException extends ApplicationException {
  public static readonly ERROR_CODE = 403;

  constructor(message: string, errorCode: string, details: string[]) {
    super(message, errorCode, details, ForbiddenException.ERROR_CODE);
  }
}