import { Injectable, Inject } from '@nestjs/common';
import * as winston from 'winston';
import { WINSTON_LOGGER_TOKEN } from '../constants';
import { LoggingProviderPort } from '../interfaces';

@Injectable()
export class LoggingProviderService implements LoggingProviderPort {
    constructor(@Inject(WINSTON_LOGGER_TOKEN) private readonly logger: winston.Logger) { }

    error(message: string, context?: any): void {
        this.logger.error(message, { context });
    }

    warn(message: string, context?: any): void {
        this.logger.warn(message, { context });
    }

    info(message: string, context?: any): void {
        this.logger.info(message, { context });
    }

    debug(message: string, context?: any): void {
        this.logger.debug(message, { context });
    }

    log(level: string, message: string, context?: any): void {
        this.logger.log(level, message, { context });
    }
}