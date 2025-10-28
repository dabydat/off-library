export abstract class DomainException extends Error {
    constructor(
        message: string,
        public readonly exceptionName: string,
        public readonly details?: any,
    ) {
        super(message);
        this.name = exceptionName;
    }
}
