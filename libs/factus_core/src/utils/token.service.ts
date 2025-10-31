import { type CacheProvider, MEMCACHED_CLIENT_TOKEN } from "@app/cache_provider";
import { Inject, Injectable } from "@nestjs/common";
import { TokenMetadata } from "../models/auth/token-metadata";
import { AuthFactus } from "../models/auth/auth.factus";

@Injectable()
export class TokenService {
    private readonly REFRESH_BUFFER_SECONDS = 300;
    constructor(
        @Inject(MEMCACHED_CLIENT_TOKEN) private readonly cacheClient: CacheProvider
    ) { }

    /**
     * Obtiene un token válido desde la caché, o null si no hay ninguno válido
     */

    public async getValidTokenFromCache(): Promise<AuthFactus | null> {
        const cached = await this.cacheClient.get({ key: 'factus_token_metadata' });
        if (!cached.exists) return null;

        const metadata = cached.value as TokenMetadata;
        const remaining = await this.getTokenTimeRemaining();

        return remaining <= this.REFRESH_BUFFER_SECONDS ? null : metadata.token;
    }

    /**
     * Obtiene cuántos segundos le quedan al token actual
     */
    public async getTokenTimeRemaining(): Promise<number> {
        const cached = await this.cacheClient.get({ key: 'factus_token_metadata' });
        if (!cached.exists) return 0;

        const metadata = cached.value as TokenMetadata;
        const now = Math.floor(Date.now() / 1000);
        const remaining = metadata.expiresAt - now;

        return Math.max(0, remaining); // No devolver negativos
    }

    public async saveTokenWithMetadata(tokenData: AuthFactus): Promise<void> {
        const now = Math.floor(Date.now() / 1000);
        const expiresIn = tokenData.expires_in || 3600;

        const metadata: TokenMetadata = {
            token: tokenData,
            cachedAt: now,
            expiresAt: now + expiresIn
        };

        // Guardar metadata con TTL un poco mayor al del token
        await this.cacheClient.set({
            key: 'factus_token_metadata',
            value: metadata,
            ttl: expiresIn + 60, // 1 minuto extra para metadata
        });
    }
}