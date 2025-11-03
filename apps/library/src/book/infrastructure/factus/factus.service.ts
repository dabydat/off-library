import { FactusPort } from "../../domain/ports/factus.port";
import { Injectable } from "@nestjs/common";
import { MunicipalitiesService } from "@app/factus_core/services/municipalities.service";

/**
 * Adapter para Factus API
 * El token se maneja automáticamente por el interceptor de ApiService
 * No necesitas llamar fetchToken() manualmente
 */
@Injectable()
export class FactusAdapter implements FactusPort {
    constructor(
        private readonly municipalitiesService: MunicipalitiesService
    ) { }

    /**
     * Obtiene municipios desde Factus API
     * El token Bearer se inyecta automáticamente
     */
    async getMunicipalities(): Promise<string[]> {
        // El token se obtiene e inyecta automáticamente en el interceptor
        // No necesitas llamar fetchToken() aquí
        const municipalities = await this.municipalitiesService.getMunicipalities();
        console.log(municipalities);
        // Transformar la respuesta según tu necesidad
        return municipalities;
    }
}