import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, Binding} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {UserAuthenticationSequence} from './sequence';
import {AuthenticationComponent, registerAuthenticationStrategy, AuthenticationBindings} from '@loopback/authentication';
import {UserAuthenticationStrategy} from './strategies/user-authentication-strategy';
import {UserAuthenticationBindings} from './keys';
import {UserAuthenticationService, UserProfileFactoryFunction} from './services/user-auth-service';

export {ApplicationConfig};

export class ApiApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    // Set up the custom sequence
    this.sequence(UserAuthenticationSequence);
    this.component(AuthenticationComponent);
    this.bind(UserAuthenticationBindings.USER_SERVICE).toClass(UserAuthenticationService);
    this.bind(AuthenticationBindings.USER_PROFILE_FACTORY).to(UserProfileFactoryFunction);

    registerAuthenticationStrategy(this, UserAuthenticationStrategy);
  }
}
