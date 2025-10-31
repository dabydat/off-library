import { FactusPort } from "../../domain/ports/factus.port";
import { Inject, Injectable } from "@nestjs/common";
import { ApiService, AuthFactus } from "@app/factus_core";
import { MunicipalitiesService } from "@app/factus_core/services/municipalities.service";

@Injectable()
export class FactusAdapter implements FactusPort {
    constructor(
        private readonly factusApiService: ApiService,
        private readonly municipalitiesService: MunicipalitiesService
    ) { }

    async getMunicipalities(): Promise<string[]> {
        const token = await this.factusApiService.fetchToken() as AuthFactus;

        const municipalities = await this.municipalitiesService.getMunicipalities();
        console.log(municipalities);
        return municipalities;
    }
}