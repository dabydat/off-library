export interface ErrorDetail {
    message: string;
    code: string;
    param?: string;
}

export interface ErrorMetadata {
    exceptionType: string;
    exceptionName?: string;
}

export interface ErrorPayload {
    status: number;
    details: ErrorDetail[];
    meta: ErrorMetadata;
}

export class ErrorPayloadBuilder {
    private status: number = 500;
    private details: ErrorDetail[] = [];
    private meta: ErrorMetadata = { exceptionType: 'Unknown' };

    withStatus(status: number): this {
        this.status = status;
        return this;
    }

    addDetail(message: string, code: string, param?: string): this {
        this.details.push({
            message: this.sanitizeMessage(message),
            code: code.toUpperCase(),
            param,
        });
        return this;
    }

    addDetails(details: ErrorDetail[]): this {
        details.forEach(detail => {
            this.addDetail(detail.message, detail.code, detail.param);
        });
        return this;
    }

    withMeta(meta: ErrorMetadata): this {
        this.meta = meta;
        return this;
    }

    build(): ErrorPayload {
        if (this.details.length === 0) {
            this.addDetail('Internal server error', 'INTERNAL_ERROR');
        }

        return {
            status: this.status,
            details: this.details,
            meta: this.meta,
        };
    }

    private sanitizeMessage(message: string): string {
        const dangerousPatterns = [
            'There is no matching message handler defined in the remote service.',
            'Connection refused',
            'ECONNREFUSED',
            'ENOTFOUND',
            'getaddrinfo',
        ];

        for (const pattern of dangerousPatterns) {
            if (message.includes(pattern)) {
                return 'Service temporarily unavailable';
            }
        }

        return message;
    }
}