import * as winston from 'winston';
import { WinstonOptions } from '../interfaces';
import { LogFormatter } from '../formatters';

export class LoggerFactory {
    /**
     * Crea una instancia de logger de Winston con configuración personalizada
     */
    static createLogger(options: WinstonOptions): winston.Logger {
        return winston.createLogger({
            level: options.level || 'info',
            silent: options.silent || false,
            format: options.format || LogFormatter.createFormat(),
            transports: options.transports || [
                new winston.transports.Console()
            ],
            exitOnError: options.exitOnError ?? false,
        });
    }
}