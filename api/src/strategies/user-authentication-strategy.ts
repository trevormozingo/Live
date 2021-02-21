import {inject} from '@loopback/context';
import {AuthenticationStrategy} from '@loopback/authentication';
import {UserProfile, SecurityBindings} from '@loopback/security';
import {RedirectRoute, Request} from '@loopback/rest';
import {UserAuthenticationBindings} from '../keys';
import {UserAuthenticationService} from '../services/user-auth-service';

export class UserAuthenticationStrategy implements AuthenticationStrategy {
  name: string = 'user';

  constructor(
    @inject(UserAuthenticationBindings.USER_SERVICE)
    private userService: UserAuthenticationService,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | RedirectRoute | undefined> {

    console.log("Authenticating...");

    this.userService.lookupUser(request);

    console.log("Done");

    const user = undefined;

    // const user = this.userService.convertToUserProfile(request)

    // console.log(request)
    // const credentials: Credentials = this.extractCredentials(request);
    // const user = await this.userService.verifyCredentials(credentials);
    // const userProfile = this.userService.convertToUserProfile(user);
    // return userProfile;

      return user;
  }
}