"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureADAuthStrategyFactoryProvider = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const keys_1 = require("../../keys");
const passport_azure_ad_1 = require("passport-azure-ad");
let AzureADAuthStrategyFactoryProvider = class AzureADAuthStrategyFactoryProvider {
    constructor(verifierAzureADAuth) {
        this.verifierAzureADAuth = verifierAzureADAuth;
    }
    value() {
        return (options) => this.getAzureADAuthStrategyVerifier(options);
    }
    getAzureADAuthStrategyVerifier(options) {
        if (options && options.passReqToCallback === true) {
            return new passport_azure_ad_1.OIDCStrategy(options, 
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            async (req, profile, done) => {
                if (!profile.oid) {
                    return done(new Error('No oid found'), null);
                }
                try {
                    const user = await this.verifierAzureADAuth(profile, done, req);
                    if (!user) {
                        throw new rest_1.HttpErrors.Unauthorized("Invalid Credentials" /* InvalidCredentials */);
                    }
                    done(null, user);
                }
                catch (err) {
                    done(err);
                }
            });
        }
        else {
            return new passport_azure_ad_1.OIDCStrategy(options, 
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            async (profile, done) => {
                if (!profile.oid) {
                    return done(new Error('No oid found'), null);
                }
                try {
                    const user = await this.verifierAzureADAuth(profile, done);
                    if (!user) {
                        throw new rest_1.HttpErrors.Unauthorized("Invalid Credentials" /* InvalidCredentials */);
                    }
                    done(null, user);
                }
                catch (err) {
                    done(err);
                }
            });
        }
    }
};
AzureADAuthStrategyFactoryProvider = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject(keys_1.Strategies.Passport.AZURE_AD_VERIFIER)),
    tslib_1.__metadata("design:paramtypes", [Function])
], AzureADAuthStrategyFactoryProvider);
exports.AzureADAuthStrategyFactoryProvider = AzureADAuthStrategyFactoryProvider;
//# sourceMappingURL=azuread-auth-strategy-factory-provider.js.map