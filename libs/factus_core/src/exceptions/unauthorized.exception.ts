import { ApplicationException } from './application.exception';

export class UnauthorizedException extends ApplicationException {
  public static readonly ERROR_CODE = 401;

  constructor(message: string, errorCode: string, details: string[]) {
    super(message, errorCode, details, UnauthorizedException.ERROR_CODE);
  }
}