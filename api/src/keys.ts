import {BindingKey} from '@loopback/core';
import {UserAuthenticationService} from './services/user-auth-service';
import {UserProfileFactory} from '@loopback/authentication';

export namespace UserAuthenticationBindings {
  export const USER_SERVICE = BindingKey.create<UserAuthenticationService>('user.authentication.service',);
}
