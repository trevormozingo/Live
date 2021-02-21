import { Provider } from '@loopback/core';
import { VerifyFunction } from '../../types';
export declare const KeycloakStrategy: any;
export interface KeycloakStrategyFactory {
    (options: any): typeof KeycloakStrategy;
}
export declare class KeycloakStrategyFactoryProvider implements Provider<KeycloakStrategyFactory> {
    private readonly verifierKeycloak;
    constructor(verifierKeycloak: VerifyFunction.KeycloakAuthFn);
    value(): KeycloakStrategyFactory;
    getKeycloakAuthStrategyVerifier(options: any): typeof KeycloakStrategy;
}
