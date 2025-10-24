import { pbkdf2, pbkdf2Sync, randomBytes } from 'crypto';
import { Injectable } from '@nestjs/common';
import { HashingService } from '@app/common-core/domain/services/hashing.service';

@Injectable()
export class HashingServiceImpl implements HashingService {
    private readonly HASH_ITERATIONS = 15000;
    private readonly KEY_LEN = 32;
    public constructor() { }

    public async hash(password: string | Buffer): Promise<string> {
        const salt = randomBytes(12).toString('base64');
        const key = await new Promise<Buffer>((resolve, reject) => {
            pbkdf2(
                password,
                salt,
                this.HASH_ITERATIONS,
                this.KEY_LEN,
                'sha256',
                (err, derivedKey) => {
                    if (err) reject(err);
                    else resolve(derivedKey);
                },
            );
        });

        const hash = `pbkdf2_sha256$${this.HASH_ITERATIONS}$${salt}$${key.toString('base64')}`;
        return hash;
    }

    public async compare(
        password: string | Buffer,
        hash: string,
    ): Promise<boolean> {
        if (!hash.startsWith('pbkdf2_')) return false;
        const parts = hash.split('$');
        const iterations = +parts[1];
        const salt = parts[2];
        const digest = parts[0].split('_')[1];

        return (
            pbkdf2Sync(password, salt, iterations, this.KEY_LEN, digest).toString(
                'base64',
            ) === parts[3]
        );
    }
}
