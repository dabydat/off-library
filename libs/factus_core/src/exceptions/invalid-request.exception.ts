import { ApplicationException } from './application.exception';

export class InvalidRequestException extends ApplicationException {
  public static readonly ERROR_CODE = 400;

  constructor(message: string, errorCode: string, details: string[]) {
    super(message, errorCode, details, InvalidRequestException.ERROR_CODE);
  }
}
