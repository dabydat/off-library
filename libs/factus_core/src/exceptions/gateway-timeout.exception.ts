import { ApplicationException } from './application.exception';

export class GatewayTimeoutException extends ApplicationException {
  public static readonly ERROR_CODE = 504;

  constructor(message: string, errorCode: string, details: string[]) {
    super(message, errorCode, details, GatewayTimeoutException.ERROR_CODE);
  }
}