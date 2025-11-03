import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { FACTUS_TOKEN } from '../constants';
import { type FactusOptions } from '../interfaces';
import { InvalidRequestException, NotFoundRequestException, UnhandledApiStatusException, BadGatewayException, ForbiddenException, GatewayTimeoutException, GoneException, ServiceUnavailableException, UnauthorizedException, ApplicationException } from '../exceptions';
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AuthService } from './auth.service';

@Injectable()
export class ApiService {
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
        private readonly authService: AuthService,
    ) {

        // Validar opciones requeridas
        if (!options.url) throw new Error('URL must be defined');
        if (!options.clientId) throw new Error('Client ID must be defined');
        if (!options.clientSecret) throw new Error('Client secret must be defined');
        if (!options.username) throw new Error('Username must be defined');
        if (!options.password) throw new Error('Password must be defined');

        this.httpService.axiosRef.interceptors.request.use(
            async (config: InternalAxiosRequestConfig) => {
                const token = await this.authService.fetchToken();
                config.baseURL = options.url;
                config.headers['Authorization'] = `Bearer ${token.access_token}`;
                return config;
            },
            (error) => Promise.reject(new Error(error)),
        );

        this.httpService.axiosRef.interceptors.response.use((responseConfig: AxiosResponse): AxiosResponse<any, any> => responseConfig);
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
