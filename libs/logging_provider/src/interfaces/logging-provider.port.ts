export interface LoggingProviderPort {
    error(message: string, context?: any): void;
    warn(message: string, context?: any): void;
    info(message: string, context?: any): void;
    debug(message: string, context?: any): void;
    log(level: string, message: string, context?: any): void;
}