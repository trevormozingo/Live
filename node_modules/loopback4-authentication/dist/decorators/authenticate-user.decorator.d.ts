/// <reference types="express" />
import { Constructor } from '@loopback/context';
import { Request } from '@loopback/rest';
import { AuthenticationMetadata } from '../types';
/**
 * `@authenticate` decorator for adding authentication to controller methods
 *
 * @param strategyName  Name of the Strategy. Use Strategy enum
 * like `Strategy.LOCAL`
 * @param options       Extra options to be passed on
 * while instantiating strategy specific class
 * @param authOptions   Extra options to be passed on to `authenticate` method
 * of the strategy.
 * This is a creator function which should return an object with options.
 * The request object is passed on as parameter to the method.
 * It can be used to setup `state` parameters based on request for google-auth,
 * for example.
 */
export declare function authenticate(strategyName: string, options?: Object, authOptions?: (req: Request) => Object): MethodDecorator;
export declare function getAuthenticateMetadata(controllerClass: Constructor<{}>, methodName: string): AuthenticationMetadata | undefined;
