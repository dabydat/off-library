export const ENCRYPTION_SERVICE = Symbol('ENCRYPTION_SERVICE');

export interface EncryptionService {
    encrypt(text: string): string;
    decrypt(encryptedText: string): string;
}