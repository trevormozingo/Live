"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthStrategyProvider = void 0;
const tslib_1 = require("tslib");
const context_1 = require("@loopback/context");
const keys_1 = require("../keys");
const keys_2 = require("./keys");
let AuthStrategyProvider = class AuthStrategyProvider {
    constructor(metadata, getLocalStrategyVerifier, getBearerStrategyVerifier, getResourceOwnerVerifier, getGoogleAuthVerifier, getAzureADAuthVerifier, getKeycloakVerifier) {
        this.metadata = metadata;
        this.getLocalStrategyVerifier = getLocalStrategyVerifier;
        this.getBearerStrategyVerifier = getBearerStrategyVerifier;
        this.getResourceOwnerVerifier = getResourceOwnerVerifier;
        this.getGoogleAuthVerifier = getGoogleAuthVerifier;
        this.getAzureADAuthVerifier = getAzureADAuthVerifier;
        this.getKeycloakVerifier = getKeycloakVerifier;
    }
    value() {
        if (!this.metadata) {
            return undefined;
        }
        const name = this.metadata.strategy;
        if (name === "local" /* LOCAL */) {
            return this.getLocalStrategyVerifier(this.metadata.options);
        }
        else if (name === "bearer" /* BEARER */) {
            return this.getBearerStrategyVerifier(this.metadata.options);
        }
        else if (name === "OAuth2 resource owner grant" /* OAUTH2_RESOURCE_OWNER_GRANT */) {
            return this.getResourceOwnerVerifier(this.metadata
                .options);
        }
        else if (name === "Google Oauth 2.0" /* GOOGLE_OAUTH2 */) {
            return this.getGoogleAuthVerifier(this.metadata.options);
        }
        else if (name === "Azure AD" /* AZURE_AD */) {
            return this.getAzureADAuthVerifier(this.metadata.options);
        }
        else if (name === "keycloak" /* KEYCLOAK */) {
            return this.getKeycloakVerifier(this.metadata.options);
        }
        else {
            return Promise.reject(`The strategy ${name} is not available.`);
        }
    }
};
AuthStrategyProvider = tslib_1.__decorate([
    tslib_1.__param(0, context_1.inject(keys_1.AuthenticationBindings.USER_METADATA)),
    tslib_1.__param(1, context_1.inject(keys_2.Strategies.Passport.LOCAL_STRATEGY_FACTORY)),
    tslib_1.__param(2, context_1.inject(keys_2.Strategies.Passport.BEARER_STRATEGY_FACTORY)),
    tslib_1.__param(3, context_1.inject(keys_2.Strategies.Passport.RESOURCE_OWNER_STRATEGY_FACTORY)),
    tslib_1.__param(4, context_1.inject(keys_2.Strategies.Passport.GOOGLE_OAUTH2_STRATEGY_FACTORY)),
    tslib_1.__param(5, context_1.inject(keys_2.Strategies.Passport.AZURE_AD_STRATEGY_FACTORY)),
    tslib_1.__param(6, context_1.inject(keys_2.Strategies.Passport.KEYCLOAK_STRATEGY_FACTORY)),
    tslib_1.__metadata("design:paramtypes", [Object, Function, Function, Function, Function, Function, Function])
], AuthStrategyProvider);
exports.AuthStrategyProvider = AuthStrategyProvider;
//# sourceMappingURL=user-auth-strategy.provider.js.map