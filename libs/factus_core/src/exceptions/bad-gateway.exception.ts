import { ApplicationException } from './application.exception';

export class BadGatewayException extends ApplicationException {
  public static readonly ERROR_CODE = 502;

  constructor(message: string, errorCode: string, details: string[]) {
    super(message, errorCode, details, BadGatewayException.ERROR_CODE);
  }
}