import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import assert from 'assert';
import { FACTUS_TOKEN } from '../constants';
import { type FactusOptions } from '../interfaces';
import { InvalidRequestException, NotFoundRequestException, UnhandledApiStatusException, BadGatewayException, ForbiddenException, GatewayTimeoutException, GoneException, ServiceUnavailableException, UnauthorizedException, ApplicationException } from '../exceptions';
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AuthFactus } from '../models/auth/auth.factus';
import { GrantType } from '../enums/grand-type.enum';
import { type CacheProvider, MEMCACHED_CLIENT_TOKEN } from '@app/cache_provider';
import { TokenService } from '../utils/token.service';

@Injectable()
export class ApiService {
    private readonly options: FactusOptions;

    private readonly exceptionMap: Record<
        string,
        new (message: string, errorCode: string, details: string[]) => ApplicationException
    > = {
            [InvalidRequestException.ERROR_CODE]: InvalidRequestException,
            [NotFoundRequestException.ERROR_CODE]: NotFoundRequestException,
            [BadGatewayException.ERROR_CODE]: BadGatewayException,
            [ForbiddenException.ERROR_CODE]: ForbiddenException,
            [GatewayTimeoutException.ERROR_CODE]: GatewayTimeoutException,
            [GoneException.ERROR_CODE]: GoneException,
            [ServiceUnavailableException.ERROR_CODE]: ServiceUnavailableException,
            [UnauthorizedException.ERROR_CODE]: UnauthorizedException
        };

    constructor(
        private readonly httpService: HttpService,
        @Inject(FACTUS_TOKEN) options: FactusOptions,
        @Inject(MEMCACHED_CLIENT_TOKEN) private readonly cacheClient: CacheProvider,
        private readonly tokenService: TokenService
    ) {
        this.options = options;
        assert(this.options.url, 'URL must be defined');
        assert(this.options.grantType, 'Grant type must be defined');
        assert(this.options.clientId, 'Client ID must be defined');
        assert(this.options.clientSecret, 'Client secret must be defined');
        assert(this.options.username, 'Username must be defined');
        assert(this.options.password, 'Password must be defined');

        this.httpService.axiosRef.interceptors.request.use(
            async (config: InternalAxiosRequestConfig) => {
                const token = await this.fetchToken();
                config.baseURL = this.options.url;
                config.headers['Authorization'] = `Bearer ${token.access_token}`;
                return config;
            },
            (error) => Promise.reject(new Error(error)),
        );

        this.httpService.axiosRef.interceptors.response.use((responseConfig: AxiosResponse): AxiosResponse<any, any> => responseConfig);
    }

    private async fetchToken(): Promise<AuthFactus> {
        // 1. Verificar si hay token válido en cache
        const cachedToken = await this.tokenService.getValidTokenFromCache();
        if (cachedToken) return cachedToken;

        // 2. Intentar refresh token si existe
        const refreshCached = await this.cacheClient.get({ key: 'factus_refresh_token' });
        if (refreshCached.exists) {
            try {
                const refreshedToken = await this.refreshToken(refreshCached.value as string);
                await this.tokenService.saveTokenWithMetadata(refreshedToken);
                return refreshedToken;
            } catch (error) {
                // Refresh falló, limpiar refresh token
                await this.cacheClient.delete({ key: 'factus_refresh_token' });
            }
        }

        // 3. Login completo como último recurso
        const response = await fetch(`${this.options.url}/oauth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                grant_type: GrantType.PASSWORD,
                client_id: this.options.clientId,
                client_secret: this.options.clientSecret,
                username: this.options.username,
                password: this.options.password,
            }),
        });

        if (!response.ok) {
            throw new Error(`Login failed: ${response.status} ${response.statusText}`);
        }

        const tokenData: AuthFactus = await response.json();

        // Guardar token con metadata
        await this.tokenService.saveTokenWithMetadata(tokenData);

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

    private async refreshToken(refreshToken: string): Promise<AuthFactus> {
        const response = await fetch(`${this.options.url}/oauth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                grant_type: GrantType.REFRESH_TOKEN,
                client_id: this.options.clientId,
                client_secret: this.options.clientSecret,
                refresh_token: refreshToken,
            }),
        });

        if (!response.ok) {
            throw new Error(`Refresh token failed: ${response.status}`);
        }

        return await response.json();
    }

    private handleApiError(errorCode: string, message: string, details: string[]): void {
        const ExceptionClass = this.exceptionMap[errorCode];
        if (ExceptionClass) throw new ExceptionClass(message, errorCode, details);
        throw new UnhandledApiStatusException(`Unknown error: ${message}`, errorCode, details,);
    }

    private handleError(error: any): void {
        const raw = error?.response?.data;
        const errorCode = raw?.error?.error_code || raw?.error_code || 'UNKNOWN_ERROR';
        const detailsArray = raw?.error?.details ?? [];
        const details: string[] = Array.isArray(detailsArray) ? detailsArray.map((d) => d.detail || d.message || 'No details') : [raw?.message || 'Unknown error'];
        const message = details.length > 0 ? details.join(', ') : 'Unknown error';
        this.handleApiError(errorCode, message, details);
    }

    private async request<T>(method: 'get' | 'post' | 'patch' | 'delete', path: string, config: AxiosRequestConfig = {}, extractData = true): Promise<T> {
        try {
            const response = await firstValueFrom(this.httpService.request({ method, url: path, ...config }));
            return extractData ? response.data?.data : response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    public get<T>(path: string, extractData = true): Promise<T> {
        return this.request<T>('get', path, {}, extractData);
    }

    public post<T>(path: string, payload: any, extractData = true, headers?: Record<string, string>,
    ): Promise<T> {
        return this.request<T>('post', path, { data: payload, headers }, extractData);
    }

    public patch<T>(path: string, payload: any, extractData = false): Promise<T> {
        return this.request<T>('patch', path, { data: payload }, extractData);
    }

    public delete<T>(path: string, payload: any, extractData = false): Promise<T> {
        return this.request<T>('delete', path, { data: payload }, extractData);
    }
}
