import { ApplicationException } from './application.exception';

export class ServiceUnavailableException extends ApplicationException {
  public static readonly ERROR_CODE = 503;

  constructor(message: string, errorCode: string, details: string[]) {
    super(message, errorCode, details, ServiceUnavailableException.ERROR_CODE);
  }
}