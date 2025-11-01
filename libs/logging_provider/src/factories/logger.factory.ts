import * as winston from 'winston';
import { WinstonOptions } from '../interfaces';
import { LogFormatter } from '../formatters';

export class LoggerFactory {
    private static loggerInstance: winston.Logger | null = null;

    /**
     * Crea una instancia de logger de Winston con configuración personalizada
     * Implementación de patrón Singleton para evitar duplicación de logs
     */
    static createLogger(options: WinstonOptions): winston.Logger {
        // Si ya existe una instancia, la limpiamos antes de crear una nueva
        if (this.loggerInstance) this.clearLogger(this.loggerInstance);

        // Crear los transports
        const transports = options.transports || [
            new winston.transports.Console()
        ];

        // Crear el logger con los transports limpios
        this.loggerInstance = winston.createLogger({
            level: options.level || 'info',
            silent: options.silent || false,
            format: options.format || LogFormatter.createFormat(),
            transports: transports,
            exitOnError: options.exitOnError ?? false,
        });

        return this.loggerInstance;
    }

    /**
     * Limpia todos los transportes de un logger para evitar duplicación
     */
    private static clearLogger(logger: winston.Logger): void {
        // Cerrar todos los transports antes de limpiar (evita memory leaks)
        logger.transports.forEach(transport => {
            if (transport.close && typeof transport.close === 'function') {
                transport.close();
            }
        });

        // Remover todos los transports existentes
        logger.clear();
    }

    /**
     * Resetea la instancia del logger (útil para testing)
     */
    static resetLogger(): void {
        if (this.loggerInstance) {
            this.clearLogger(this.loggerInstance);
            this.loggerInstance = null;
        }
    }
}