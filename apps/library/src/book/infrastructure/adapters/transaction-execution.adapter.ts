import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { TransactionExcecutionPort } from '../../domain/ports/transaction-execution.port';

@Injectable()
export class TransactionExecutionAdapter implements TransactionExcecutionPort {
    constructor(private readonly dataSource: DataSource) { }

    async execute<T>(work: (manager: EntityManager) => Promise<T>): Promise<T> {
        return this.dataSource.transaction(work);
    }
}
