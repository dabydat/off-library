export abstract class ValueObjectException extends Error {
    constructor(
        message: string,
        public readonly exceptionName: string,
        public readonly details?: string,
    ) {
        super(message);
        this.name = exceptionName;
    }
}
