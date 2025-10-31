import { AuthFactus } from "./auth.factus";

export interface TokenMetadata {
    token: AuthFactus;
    cachedAt: number;
    expiresAt: number;
}