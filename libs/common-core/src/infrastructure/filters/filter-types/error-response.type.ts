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