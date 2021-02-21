"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthStrategyFactoryProvider = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
//import * as GoogleStrategy from 'passport-google-oauth20';
const passport_google_oauth20_1 = require("passport-google-oauth20");
const keys_1 = require("../../keys");
let GoogleAuthStrategyFactoryProvider = class GoogleAuthStrategyFactoryProvider {
    constructor(verifierGoogleAuth) {
        this.verifierGoogleAuth = verifierGoogleAuth;
    }
    value() {
        return (options) => this.getGoogleAuthStrategyVerifier(options);
    }
    getGoogleAuthStrategyVerifier(options) {
        if (options && options.passReqToCallback === true) {
            return new passport_google_oauth20_1.Strategy(options, 
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            async (req, accessToken, refreshToken, profile, cb) => {
                try {
                    const user = await this.verifierGoogleAuth(accessToken, refreshToken, profile, cb, req);
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
        else {
            return new passport_google_oauth20_1.Strategy(options, 
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            async (accessToken, refreshToken, profile, cb) => {
                try {
                    const user = await this.verifierGoogleAuth(accessToken, refreshToken, profile, cb);
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
    }
};
GoogleAuthStrategyFactoryProvider = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject(keys_1.Strategies.Passport.GOOGLE_OAUTH2_VERIFIER)),
    tslib_1.__metadata("design:paramtypes", [Function])
], GoogleAuthStrategyFactoryProvider);
exports.GoogleAuthStrategyFactoryProvider = GoogleAuthStrategyFactoryProvider;
//# sourceMappingURL=google-auth-strategy-factory-provider.js.map