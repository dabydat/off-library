export const HASHING_SERVICE = Symbol('HASHING_SERVICE');

export interface HashingService {
    hash(password: string | Buffer): Promise<string>;
    compare(password: string | Buffer, hash: string): Promise<boolean>;
}
