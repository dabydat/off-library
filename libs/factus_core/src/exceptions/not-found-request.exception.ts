import { ApplicationException } from './application.exception';

export class NotFoundRequestException extends ApplicationException {
  public static readonly ERROR_CODE = 404;

  constructor(message: string, errorCode: string, details: string[]) {
    super(message, errorCode, details, NotFoundRequestException.ERROR_CODE);
  }
}
