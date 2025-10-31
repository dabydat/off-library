export interface ErrorDetail {
    message: string;
    code: string;
    param?: string;
}

export interface ErrorPayload {
    status: number;
    details: ErrorDetail[];
    meta: {
        exceptionType: string;
        exceptionName?: string;
    };
}

export type ErrorResponseType = {
    status: 'error';
    timestamp: string;
    path: string;
    method: string;
    details: Array<{
        message: string;
        code: string;
        param?: string;
    }>;
    meta: {
        exceptionType: string;
        exceptionName?: string;
        handler: string;
    };
}

