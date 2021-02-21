import { Provider, ValueOrPromise } from '@loopback/context';
import { Strategy } from 'passport';
import { AuthenticationMetadata } from '../types';
import { BearerStrategyFactory } from './passport/passport-bearer';
import { GoogleAuthStrategyFactory } from './passport/passport-google-oauth2';
import { LocalPasswordStrategyFactory } from './passport/passport-local';
import { ResourceOwnerPasswordStrategyFactory } from './passport/passport-resource-owner-password';
import { AzureADAuthStrategyFactory } from './passport/passport-azure-ad';
import { KeycloakStrategyFactory } from './passport';
export declare class AuthStrategyProvider implements Provider<Strategy | undefined> {
    private readonly metadata;
    private readonly getLocalStrategyVerifier;
    private readonly getBearerStrategyVerifier;
    private readonly getResourceOwnerVerifier;
    private readonly getGoogleAuthVerifier;
    private readonly getAzureADAuthVerifier;
    private readonly getKeycloakVerifier;
    constructor(metadata: AuthenticationMetadata, getLocalStrategyVerifier: LocalPasswordStrategyFactory, getBearerStrategyVerifier: BearerStrategyFactory, getResourceOwnerVerifier: ResourceOwnerPasswordStrategyFactory, getGoogleAuthVerifier: GoogleAuthStrategyFactory, getAzureADAuthVerifier: AzureADAuthStrategyFactory, getKeycloakVerifier: KeycloakStrategyFactory);
    value(): ValueOrPromise<Strategy | undefined>;
}
