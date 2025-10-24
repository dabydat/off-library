import { EncryptionService } from '@app/common-core/domain/services/encryption.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionServiceImpl implements EncryptionService {
    private readonly algorithm = 'aes-256-gcm';
    private readonly key: Buffer;

    constructor(private configService: ConfigService) {
        // Create a key from the provided encryption key
        const encryptionKey = this.configService.get<string>('DATABASE_ENCRYPTION_KEY');
        this.key = crypto.createHash('sha256').update(encryptionKey || 'default-key').digest();
    }

    encrypt(text: string): string {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

        const encrypted = Buffer.concat([
            cipher.update(text, 'utf8'),
            cipher.final()
        ]);

        const authTag = cipher.getAuthTag();

        // Format: iv:authTag:encryptedData (all as base64)
        return Buffer.concat([iv, authTag, encrypted]).toString('base64');
    }

    decrypt(encryptedText: string): string {
        const buffer = Buffer.from(encryptedText, 'base64');

        // Extract the parts
        const iv = buffer.slice(0, 16);
        const authTag = buffer.slice(16, 32);
        const encryptedData = buffer.slice(32);

        const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
        decipher.setAuthTag(authTag);

        return Buffer.concat([
            decipher.update(encryptedData),
            decipher.final()
        ]).toString('utf8');
    }
}