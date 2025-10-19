import { RpcException } from "@nestjs/microservices";

export interface ErrorDetail {
    message: string;
    code: string;
    param?: string | number;
}

export class TcpException extends RpcException {
    public readonly code: string | number;
    public readonly details: ErrorDetail[];

    constructor(
        message?: string,
        code?: string | number,
        details: ErrorDetail[] = [],
    ) {
        super(message ?? 'Internal Server Error');
        this.name = 'TcpException';
        this.code = code ?? 500;
        this.details = details;
    }
}
