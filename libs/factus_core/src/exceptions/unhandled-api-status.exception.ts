import { ApplicationException } from './application.exception';

export class UnhandledApiStatusException extends ApplicationException {
  constructor(message: string, errorCode: string, details: string[]) {
    super(message, errorCode, details);
  }
}
