export const TRANSACTION_EXECUTION_PORT = Symbol('TRANSACTION_EXECUTION_PORT');

export interface TransactionExcecutionPort {
    execute<T>(work: (manager: any) => Promise<T>): Promise<T>;
}