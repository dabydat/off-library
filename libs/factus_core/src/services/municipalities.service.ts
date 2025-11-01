import { Injectable } from '@nestjs/common';
import { ApiService } from './api.service';

@Injectable()
export class MunicipalitiesService {
    constructor(private readonly apiService: ApiService) { }

    public async getMunicipalities(name?: string): Promise<any> {
        const path = name
            ? `/v1/municipalities?name=${encodeURIComponent(name)}`
            : '/v1/municipalities';

        return await this.apiService.get(path);
    }
}