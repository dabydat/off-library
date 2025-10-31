import { ApiService } from "./api.service";

export class MunicipalitiesService {
    public constructor(private readonly apiService: ApiService) { }

    public async getMunicipalities(name?: string): Promise<any> {
        const response = await this.apiService.get(`/v1/municipalities?name=${name}`);
        console.log('Response:', response);
    }
}