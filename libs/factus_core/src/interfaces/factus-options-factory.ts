import { FactusOptions } from ".";

export interface FactusOptionsFactory {
  createFactusOptions():
    | FactusOptions
    | Promise<FactusOptions>;
}