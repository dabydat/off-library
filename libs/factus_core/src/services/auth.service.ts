import { CACHE_PROVIDER_SERVICE_TOKEN } from "@app/cache_provider";
import { Inject, Injectable } from "@nestjs/common";
import { TokenMetadata } from "../models/auth/token-metadata";
import { AuthFactus } from "../models/auth/auth.factus";
import { type CacheProviderPort } from "@app/cache_provider/interfaces/services/cache-provider.port";
import type { FactusOptions } from "../interfaces";
import { FACTUS_TOKEN } from "../constants";
import { GrantType } from "../enums/grand-type.enum";

@Injectable()
export class AuthService {
    private readonly REFRESH_BUFFER_SECONDS = 300;
    private tokenRefreshPromise: Promise<AuthFactus> | null = null;

    constructor(
        @Inject(CACHE_PROVIDER_SERVICE_TOKEN) private readonly cacheClient: CacheProviderPort,
        @Inject(FACTUS_TOKEN) private readonly options: FactusOptions
    ) { }

    /**
     * Obtiene un token válido con protección contra race conditions
     * Esta es la función principal que debe llamarse para obtener tokens
     * 
     * Flujo:
     * 1. Si hay request en curso, espera a que termine (semaphore)
     * 2. Verifica caché
     * 3. Intenta refresh token
     * 4. Si todo falla, hace login completo
     * 
     * @returns Token válido de Factus
     */
    public async fetchToken(): Promise<AuthFactus> {
        // Semaphore: Si ya hay una petición en curso, esperar a que termine
        if (this.tokenRefreshPromise) return this.tokenRefreshPromise;

        this.tokenRefreshPromise = this._fetchTokenInternal();

        try {
            const token = await this.tokenRefreshPromise;
            return token;
        } finally {
            this.tokenRefreshPromise = null;
        }
    }

    /**
     * Lógica interna de obtención de token
     */
    private async _fetchTokenInternal(): Promise<AuthFactus> {
        // 1. Verificar si hay token válido en cache
        const cachedToken = await this.getValidTokenFromCache();
        if (cachedToken) return cachedToken;

        // 2. Intentar refresh token si existe
        const refreshCached = await this.cacheClient.get({ key: 'factus_refresh_token' });
        if (refreshCached && refreshCached.exists && refreshCached.value) {
            try {
                const refreshedToken = await this.refreshToken(refreshCached.value as string);
                await this.saveTokenWithMetadata(refreshedToken);
                return refreshedToken;
            } catch (error) {
                // Refresh falló, limpiar refresh token
                await this.cacheClient.delete({ key: 'factus_refresh_token' });
            }
        }

        // 3. Login completo como último recurso
        const tokenData = await this.loginWithCredentials();

        // Guardar token con metadata
        await this.saveTokenWithMetadata(tokenData);

        // Guardar refresh token si existe (con TTL más largo)
        if (tokenData.refresh_token) {
            await this.cacheClient.set({
                key: 'factus_refresh_token',
                value: tokenData.refresh_token,
                ttl: 3600,
            });
        }

        return tokenData;
    }

    /**
     * Login usando credenciales (password grant)
     */
    private async loginWithCredentials(): Promise<AuthFactus> {
        try {
            const axios = require('axios');
            const response = await axios.post(
                `${this.options.url}/oauth/token`,
                {
                    grant_type: GrantType.PASSWORD,
                    client_id: this.options.clientId,
                    client_secret: this.options.clientSecret,
                    username: this.options.username,
                    password: this.options.password,
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 30000,
                }
            );
            return response.data as AuthFactus;
        } catch (error) {
            throw new Error(`Login failed: ${error?.response?.data?.message || error.message || 'Unknown error'}`);
        }
    }

    /**
     * Refresh token usando Axios directo (sin interceptor)
     */
    private async refreshToken(refreshToken: string): Promise<AuthFactus> {
        try {
            const axios = require('axios');
            const response = await axios.post(
                `${this.options.url}/oauth/token`,
                {
                    grant_type: GrantType.REFRESH_TOKEN,
                    client_id: this.options.clientId,
                    client_secret: this.options.clientSecret,
                    refresh_token: refreshToken,
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 30000,
                }
            );
            return response.data as AuthFactus;
        } catch (error) {
            throw new Error(`Refresh token failed: ${error?.response?.data?.message || error.message || 'Unknown error'}`);
        }
    }

    /**
     * Obtiene un token válido desde la caché
     * Considera el buffer de refresh (5 minutos antes de expirar)
     * 
     * @returns Token si es válido, null si expiró o no existe
     * @throws Error si falla la lectura de caché
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
     * Calcula cuántos segundos le quedan al token actual antes de expirar
     * 
     * @returns Segundos restantes, 0 si el token no existe o ya expiró
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

    /**
     * Guarda un token en caché con metadata adicional
     * 
     * @param tokenData - Token de OAuth2 con access_token, refresh_token, expires_in
     * @throws Error si falla el guardado en caché
     * 
     */
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