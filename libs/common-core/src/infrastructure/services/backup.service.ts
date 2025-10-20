import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fsPromises } from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { ENCRYPTION_SERVICE, type EncryptionService } from '@app/common-core/domain/services/encryption.service';

@Injectable()
export class BackupService implements OnModuleInit {
    private readonly logger = new Logger(BackupService.name);
    private readonly dbPath: string;
    private readonly backupDir: string;
    private readonly maxBackups: number = 30;

    constructor(
        private configService: ConfigService,
        @Inject(ENCRYPTION_SERVICE)
        private encryptionService: EncryptionService
    ) {
        // Get the database path
        const dataDir = path.join(process.cwd(), 'data');
        this.dbPath = path.join(dataDir, this.configService.get<string>('DATABASE_NAME', 'off_library.db'));
        this.backupDir = path.join(process.cwd(), 'backups');
    }

    async onModuleInit(): Promise<void> {
        // Create directories asynchronously during module initialization
        await this.ensureDirectoryExists(path.dirname(this.dbPath));
        await this.ensureDirectoryExists(this.backupDir);
    }

    private async ensureDirectoryExists(dirPath: string): Promise<void> {
        try {
            await fsPromises.access(dirPath);
        } catch (error) {
            await fsPromises.mkdir(dirPath, { recursive: true });
        }
    }

    async createBackup(): Promise<string> {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupFileName = `backup-${timestamp}.enc`;
            const backupPath = path.join(this.backupDir, backupFileName);

            // Async read
            const dbContent = await fsPromises.readFile(this.dbPath);

            // Encryption (sync operation)
            const encryptedContent = this.encryptionService.encrypt(dbContent.toString('base64'));

            // Async write
            await fsPromises.writeFile(backupPath, encryptedContent);

            // Calculate checksum
            const hashSum = crypto.createHash('sha256');
            hashSum.update(encryptedContent);
            const sha256sum = hashSum.digest('hex');

            // Async write checksum
            await fsPromises.writeFile(`${backupPath}.sha256`, sha256sum);

            this.logger.log(`Backup created: ${backupFileName}`);

            // Clean up old backups
            await this.cleanupOldBackups();

            return backupFileName;
        } catch (error) {
            this.logger.error(`Error creating backup: ${error.message}`, error.stack);
            throw new Error(`Failed to create backup: ${error.message}`);
        }
    }

    async restoreBackup(backupFileName: string): Promise<boolean> {
        try {
            const backupPath = path.join(this.backupDir, backupFileName);

            // Check if backup file exists
            try {
                await fsPromises.access(backupPath);
            } catch {
                throw new Error(`Backup file not found: ${backupFileName}`);
            }

            // Verify integrity with checksum
            const verified = await this.verifyBackupIntegrity(backupFileName);
            if (!verified) {
                throw new Error(`Backup integrity check failed for: ${backupFileName}`);
            }

            // Create a backup before restoring
            const preRestoreBackup = await this.createBackup();
            this.logger.log(`Pre-restore safety backup created: ${preRestoreBackup}`);

            // Read the encrypted backup
            const encryptedContent = await fsPromises.readFile(backupPath, 'utf8');

            // Decrypt the backup content
            const decryptedContent = this.encryptionService.decrypt(encryptedContent);

            // Convert from base64
            const dbContent = Buffer.from(decryptedContent, 'base64');

            // Write the decrypted content to the database file
            await fsPromises.writeFile(this.dbPath, dbContent);

            this.logger.log(`Backup restored successfully: ${backupFileName}`);
            return true;
        } catch (error) {
            this.logger.error(`Error restoring backup: ${error.message}`, error.stack);
            throw new Error(`Failed to restore backup: ${error.message}`);
        }
    }

    async listBackups(): Promise<{ name: string, size: number, createdAt: Date, checksum: string }[]> {
        try {
            const files = (await fsPromises.readdir(this.backupDir))
                .filter(file => file.endsWith('.enc'))
                .sort()
                .reverse();

            const backupList: { name: string; size: number; createdAt: Date; checksum: string }[] = [];
            for (const file of files) {
                const filePath = path.join(this.backupDir, file);
                const stats = await fsPromises.stat(filePath);

                let checksum = '';
                const checksumPath = `${filePath}.sha256`;

                try {
                    await fsPromises.access(checksumPath);
                    checksum = await fsPromises.readFile(checksumPath, 'utf8');
                } catch {
                    // No checksum file exists
                }

                backupList.push({
                    name: file,
                    size: stats.size,
                    createdAt: stats.mtime,
                    checksum
                });
            }

            return backupList;
        } catch (error) {
            this.logger.error(`Error listing backups: ${error.message}`, error.stack);
            throw new Error(`Failed to list backups: ${error.message}`);
        }
    }

    private async verifyBackupIntegrity(backupFileName: string): Promise<boolean> {
        try {
            const backupPath = path.join(this.backupDir, backupFileName);
            const checksumPath = `${backupPath}.sha256`;

            // Check if both files exist
            try {
                await Promise.all([
                    fsPromises.access(backupPath),
                    fsPromises.access(checksumPath)
                ]);
            } catch {
                return false;
            }

            // Read the stored checksum
            const storedChecksum = await fsPromises.readFile(checksumPath, 'utf8');

            // Calculate the current checksum
            const encryptedContent = await fsPromises.readFile(backupPath, 'utf8');
            const hashSum = crypto.createHash('sha256');
            hashSum.update(encryptedContent);
            const currentChecksum = hashSum.digest('hex');

            // Compare
            return storedChecksum === currentChecksum;
        } catch (error) {
            this.logger.error(`Error verifying backup integrity: ${error.message}`, error.stack);
            return false;
        }
    }

    private async cleanupOldBackups(): Promise<void> {
        try {
            const backups = await this.listBackups();

            // If there are more backups than the limit, delete the oldest ones
            if (backups.length > this.maxBackups) {
                const backupsToDelete = backups.slice(this.maxBackups);

                for (const backup of backupsToDelete) {
                    const backupPath = path.join(this.backupDir, backup.name);
                    const checksumPath = `${backupPath}.sha256`;

                    // Delete backup file and its checksum
                    try {
                        await fsPromises.access(backupPath);
                        await fsPromises.unlink(backupPath);
                    } catch {
                        // File doesn't exist, continue
                    }

                    try {
                        await fsPromises.access(checksumPath);
                        await fsPromises.unlink(checksumPath);
                    } catch {
                        // File doesn't exist, continue
                    }

                    this.logger.log(`Deleted old backup: ${backup.name}`);
                }
            }
        } catch (error) {
            this.logger.error(`Error cleaning up old backups: ${error.message}`, error.stack);
        }
    }
}