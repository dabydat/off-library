import { ApplicationException } from './application.exception';

export class GoneException extends ApplicationException {
  public static readonly ERROR_CODE = 410;

  constructor(message: string, errorCode: string, details: string[]) {
    super(message, errorCode, details, GoneException.ERROR_CODE);
  }
}