import * as winston from 'winston';

export class NestJSFormatter {
    private static readonly DEFAULT_TIMESTAMP_FORMAT = 'MM/DD/YYYY, h:mm:ss A';

    /**
     * Crea el formato personalizado de NestJS con detección automática de contexto
     */
    static createFormat(): winston.Logform.Format {
        return winston.format.combine(
            winston.format.timestamp({ format: this.DEFAULT_TIMESTAMP_FORMAT }),
            winston.format.errors({ stack: true }),
            winston.format.printf(({ timestamp, level, message, context, stack }) => {
                const pid = process.pid;
                const contextName = this.extractContextName(context);
                const stackStr = stack ? `\n${stack}` : '';

                // Aplicar colores personalizados según el nivel
                const coloredMessage = this.applyLevelColors(
                    String(level),
                    String(timestamp),
                    pid,
                    contextName,
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
    private static applyLevelColors(level: string, timestamp: string, pid: number, contextName: string, message: string, stackStr: string): string {
        // Colores para JSON según tus preferencias
        const jsonColors = {
            error: '\x1b[91m',          // Rojo brillante
            warn: '\x1b[93m',           // Amarillo brillante
            warning: '\x1b[93m',        // Amarillo brillante
            info: '\x1b[96m',           // Cyan brillante
            debug: '\x1b[95m',          // Púrpura real
            verbose: '\x1b[37m',        // Gris brillante
        };

        const jsonColor = jsonColors[level.toLowerCase() as keyof typeof jsonColors] || jsonColors.info;

        // Solo formato JSON estructurado con colores
        const jsonLine = this.createColoredJsonLine(level, timestamp, contextName, message, jsonColor);

        return `${jsonLine}${stackStr}`;
    }

    /**
     * Crea la línea JSON coloreada
     */
    private static createColoredJsonLine(level: string, timestamp: string, contextName: string, message: string, color: string): string {
        const reset = '\x1b[0m';

        // JSON estructurado con colores
        const jsonData = {
            level: level.toUpperCase(),
            timestamp: new Date().toISOString(),
            logger: contextName,
            message: message,
            pid: process.pid
        };

        // Crear JSON coloreado manualmente para mejor control
        const coloredJson =
            `${color}{${reset}` +
            `${color}"level"${reset}:${color}"${jsonData.level}"${reset},` +
            `${color}"timestamp"${reset}:${color}"${jsonData.timestamp}"${reset},` +
            `${color}"logger"${reset}:${color}"${jsonData.logger}"${reset},` +
            `${color}"message"${reset}:${color}"${jsonData.message}"${reset},` +
            `${color}"pid"${reset}:${color}${jsonData.pid}${reset}` +
            `${color}}${reset}`;

        return coloredJson;
    }

    /**
     * Extrae el nombre del contexto desde el objeto context o detecta automáticamente
     */
    private static extractContextName(context?: any): string {
        // Si se proporciona contexto explícito, usarlo
        if (context) {
            if (typeof context === 'string') {
                return context;
            }

            if (typeof context === 'object') {
                const ctx = context as any;
                if (ctx.context) {
                    return ctx.context;
                }
            }
        }

        // Fallback: detectar desde stack trace
        return this.detectContextFromStack();
    }

    /**
     * Detecta el contexto automáticamente desde el stack trace
     */
    private static detectContextFromStack(): string {
        try {
            const stackTrace = new Error().stack;
            if (!stackTrace) return 'Application';

            const lines = stackTrace.split('\n');

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];

                if (this.shouldSkipStackLine(line)) continue;

                const contextName = this.extractContextFromStackLine(line);
                if (contextName) return contextName;
            }
        } catch (e) {
            // Si falla la detección, usar Application
        }

        return 'Application';
    }

    /**
     * Determina si una línea del stack trace debe ser ignorada
     */
    private static shouldSkipStackLine(line: string): boolean {
        return !line ||
            line.includes('winston') ||
            line.includes('node_modules') ||
            line.includes('LoggingProvider');
    }

    /**
     * Extrae el nombre del contexto desde una línea del stack trace
     */
    private static extractContextFromStackLine(line: string): string | null {
        // Intentar extraer nombre de clase
        const classMatch = line.match(/at\s+(\w+)(?:Handler|Service|Controller|Adapter)?\./);
        if (classMatch) {
            return classMatch[1];
        }

        // Intentar extraer nombre de función
        const functionMatch = line.match(/at\s+(\w+)\s+\(/);
        if (functionMatch) {
            return functionMatch[1];
        }

        // Fallback: nombre de archivo convertido a PascalCase
        const fileMatch = line.match(/\/([^\/\s]+)\.(js|ts):/);
        if (fileMatch) {
            return this.convertToPascalCase(fileMatch[1]);
        }

        return null;
    }

    /**
     * Convierte un string con guiones o guiones bajos a PascalCase
     */
    private static convertToPascalCase(str: string): string {
        return str
            .split(/[-_]/)
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join('');
    }
}