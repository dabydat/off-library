import { ErrorDetail, TcpException } from "./tcp.exception";

export abstract class DomainException extends TcpException {
    public readonly key: string;
    public readonly args: Record<string, any>;
    constructor(message: string, code: string, param?: string, args?: Record<string, any>) {
        const details: ErrorDetail[] = [{ message, code, param }];
        super(message, 500, details);
        this.key = message;
        this.args = args || {};
    }
}
