export const FACTUS_PORT = Symbol('FACTUS_PORT')

export interface FactusPort {
    getMunicipalities(): Promise<string[]>;
}