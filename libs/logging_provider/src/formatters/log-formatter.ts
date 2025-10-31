import * as winston from 'winston';

export class LogFormatter {
    /**
     * Crea el formato JSON simplificado
     */
    static createFormat(): winston.Logform.Format {
        return winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.printf((info) => {
                const { timestamp, level, message, context, stack, ...meta } = info;

                const actualContext = context || meta.context;
                const stackStr = stack ? `${stack}` : '';

                // Aplicar colores según el nivel
                const coloredMessage = LogFormatter.applyLevelColors(
                    String(level),
                    String(timestamp),
                    actualContext,
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
    private static applyLevelColors(
        level: string,
        timestamp: string,
        contextData: any,
        message: string,
        stackStr: string
    ): string {
        // Colores para JSON según tus preferencias
        const colors = {
            error: '\x1b[91m',          // Rojo brillante
            warn: '\x1b[93m',           // Amarillo brillante
            warning: '\x1b[93m',        // Amarillo brillante
            info: '\x1b[96m',           // Cyan brillante
            debug: '\x1b[95m',          // Púrpura real
            verbose: '\x1b[37m',        // Gris brillante
        };

        const color = colors[level.toLowerCase() as keyof typeof colors] || colors.info;
        const reset = '\x1b[0m';

        // Crear JSON estructurado
        const jsonData: any = {
            level: level.toUpperCase(),
            timestamp: timestamp,
            message: message,
            pid: process.pid
        };

        if (contextData) {
            if (typeof contextData === 'string') {
                jsonData.logger = contextData;
            } else if (typeof contextData === 'object' && contextData !== null) {
                jsonData.logger = 'Application'; // Logger default
                Object.assign(jsonData, contextData);
            } else {
                jsonData.logger = 'Application';
            }
        } else {
            jsonData.logger = 'Application';
        }

        const jsonString = JSON.stringify(jsonData, null, 0);

        // JSON coloreado completo
        const coloredJson = `${color}${jsonString}${reset}`;

        return `${coloredJson}${stackStr}`;
    }
}