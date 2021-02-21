import { Provider } from '@loopback/core';
import * as ClientPasswordStrategy from 'passport-oauth2-client-password';
import { VerifyFunction } from '../../types';
export interface ClientPasswordStrategyFactory {
    (options?: ClientPasswordStrategy.StrategyOptionsWithRequestInterface): ClientPasswordStrategy.Strategy;
}
export declare class ClientPasswordStrategyFactoryProvider implements Provider<ClientPasswordStrategyFactory> {
    private readonly verifier;
    constructor(verifier: VerifyFunction.OauthClientPasswordFn);
    value(): ClientPasswordStrategyFactory;
    getClientPasswordVerifier(options?: ClientPasswordStrategy.StrategyOptionsWithRequestInterface): ClientPasswordStrategy.Strategy;
}
