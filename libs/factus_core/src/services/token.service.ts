import { CACHE_PROVIDER_SERVICE_TOKEN } from "@app/cache_provider";
import { Inject, Injectable } from "@nestjs/common";
import { TokenMetadata } from "../models/auth/token-metadata";
import { AuthFactus } from "../models/auth/auth.factus";
import { type CacheProviderPort } from "@app/cache_provider/interfaces/services/cache-provider.port";

@Injectable()
export class TokenService {
    private readonly REFRESH_BUFFER_SECONDS = 300;
    constructor(
        @Inject(CACHE_PROVIDER_SERVICE_TOKEN) private readonly cacheClient: CacheProviderPort
    ) { }

    /**
     * Obtiene un token válido desde la caché, o null si no hay ninguno válido
     */

    public async getValidTokenFromCache(): Promise<AuthFactus | null> {
        try {
            const cached = await this.cacheClient.get({ key: 'factus_token_metadata' });
            if (!cached || cached.exists === false || !cached.value) {
                return null;
            }
            const metadata = JSON.parse(cached.value as string) as TokenMetadata;
            const remaining = await this.getTokenTimeRemaining();

            return remaining <= this.REFRESH_BUFFER_SECONDS ? null : metadata.token;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene cuántos segundos le quedan al token actual
     */
    public async getTokenTimeRemaining(): Promise<number> {
        try {
            const cached = await this.cacheClient.get({ key: 'factus_token_metadata' });
            if (!cached || !cached.exists || !cached.value) {
                return 0;
            }

            // Deserializar el JSON
            const metadata = JSON.parse(cached.value as string) as TokenMetadata;
            const now = Math.floor(Date.now() / 1000);
            const remaining = metadata.expiresAt - now;

            return Math.max(0, remaining); // No devolver negativos
        } catch (error) {
            return 0;
        }
    }

    public async saveTokenWithMetadata(tokenData: AuthFactus): Promise<void> {
        try {
            const now = Math.floor(Date.now() / 1000);
            const expiresIn = tokenData.expires_in || 3600;

            const metadata: TokenMetadata = {
                token: tokenData,
                cachedAt: now,
                expiresAt: now + expiresIn
            };

            // Serializar metadata a JSON string
            const serializedMetadata = JSON.stringify(metadata);

            // Guardar metadata con TTL un poco mayor al del token
            await this.cacheClient.set({
                key: 'factus_token_metadata',
                value: serializedMetadata,
                ttl: expiresIn + 60, // 1 minuto extra para metadata
            });
        } catch (error) {
            throw error;
        }
    }
}