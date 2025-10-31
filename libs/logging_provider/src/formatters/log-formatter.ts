import * as winston from 'winston';

export class LogFormatter {
    /**
     * Crea el formato JSON simplificado
     */
    static createFormat(): winston.Logform.Format {
        return winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.printf(({ timestamp, level, message, context, stack }) => {
                const contextName = context || 'Application';
                const stackStr = stack ? `\n${stack}` : '';

                // Aplicar colores según el nivel
                const coloredMessage = this.applyLevelColors(
                    String(level),
                    String(timestamp),
                    String(contextName),
                    String(message),
                    stackStr
                );

                return coloredMessage;
            })
        );
    }

    /**
     * Aplica colores específicos según el nivel del log - Solo formato JSON
     */
    private static applyLevelColors(level: string, timestamp: string, contextName: string, message: string, stackStr: string): string {
        // Colores para JSON según tus preferencias
        const color = {
            error: '\x1b[91m',          // Rojo brillante
            warn: '\x1b[93m',           // Amarillo brillante
            warning: '\x1b[93m',        // Amarillo brillante
            info: '\x1b[96m',           // Cyan brillante
            debug: '\x1b[95m',          // Púrpura real
            verbose: '\x1b[37m',        // Gris brillante
        };

        const json = color[level.toLowerCase() as keyof typeof color] || color.info;

        // Crear JSON estructurado con colores
        const jsonData = {
            level: level.toUpperCase(),
            timestamp: timestamp,
            logger: contextName,
            message: message,
            pid: process.pid
        };

        // JSON coloreado simple
        const coloredJson =
            `${json}{${'\x1b[0m'}` +
            `${json}"level"${'\x1b[0m'}:${json}"${jsonData.level}"${'\x1b[0m'},` +
            `${json}"timestamp"${'\x1b[0m'}:${json}"${jsonData.timestamp}"${'\x1b[0m'},` +
            `${json}"logger"${'\x1b[0m'}:${json}"${jsonData.logger}"${'\x1b[0m'},` +
            `${json}"message"${'\x1b[0m'}:${json}"${jsonData.message}"${'\x1b[0m'},` +
            `${json}"pid"${'\x1b[0m'}:${json}${jsonData.pid}${'\x1b[0m'}` +
            `${json}}${'\x1b[0m'}`;

        return `${coloredJson}${stackStr}`;
    }
}