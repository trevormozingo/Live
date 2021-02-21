"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeycloakStrategyFactoryProvider = exports.KeycloakStrategy = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const keys_1 = require("../../keys");
exports.KeycloakStrategy = require('@exlinc/keycloak-passport');
let KeycloakStrategyFactoryProvider = class KeycloakStrategyFactoryProvider {
    constructor(verifierKeycloak) {
        this.verifierKeycloak = verifierKeycloak;
    }
    value() {
        return (options) => this.getKeycloakAuthStrategyVerifier(options);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getKeycloakAuthStrategyVerifier(options) {
        return new exports.KeycloakStrategy(options, async (accessToken, refreshToken, profile, cb) => {
            try {
                const user = await this.verifierKeycloak(accessToken, refreshToken, profile, cb);
                if (!user) {
                    throw new rest_1.HttpErrors.Unauthorized("Invalid Credentials" /* InvalidCredentials */);
                }
                cb(undefined, user);
            }
            catch (err) {
                cb(err);
            }
        });
    }
};
KeycloakStrategyFactoryProvider = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject(keys_1.Strategies.Passport.KEYCLOAK_VERIFIER)),
    tslib_1.__metadata("design:paramtypes", [Function])
], KeycloakStrategyFactoryProvider);
exports.KeycloakStrategyFactoryProvider = KeycloakStrategyFactoryProvider;
//# sourceMappingURL=keycloak-strategy-factory-provider.js.map