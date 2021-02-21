import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {AuthenticationBindings, UserProfileFactory} from '@loopback/authentication';
import {UserProfile, securityId} from '@loopback/security';
import {UserRepository} from '../repositories';
import {Request} from '@loopback/rest';
import {User} from '../models';

class UserFields {
  first_name: string;
  last_name:  string;
  username:   string;
  password:   string;
  email:      string;
  phone:      string;
}

export const UserProfileFactoryFunction: UserProfileFactory<UserFields> = function (user: UserFields,): UserProfile {

  const userProfile = {
    [securityId]: user.username,
    first_name:   user.first_name,
    last_name:    user.last_name,
    username:     user.username,
    email:        user.email,
    phone:        user.phone
  }

  return userProfile;
}

export class UserAuthenticationService {

  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,

    @inject(AuthenticationBindings.USER_PROFILE_FACTORY)
    public userProfileFactory: UserProfileFactory<UserFields>,
  ) {}

  // async verifyCredentials(
  //   credentials: BasicAuthenticationStrategyCredentials,
  // ): Promise<User> {
  //   if (!credentials) {
  //     throw new HttpErrors.Unauthorized(`'credentials' is null`);
  //   }

  //   if (!credentials.username) {
  //     throw new HttpErrors.Unauthorized(`'credentials.username' is null`);
  //   }

  //   if (!credentials.password) {
  //     throw new HttpErrors.Unauthorized(`'credentials.password' is null`);
  //   }

  //   const foundUser = this.userRepository.find(credentials.username);
  //   if (!foundUser) {
  //     throw new HttpErrors['Unauthorized'](
  //       `User with username ${credentials.username} not found.`,
  //     );
  //   }

  //   if (credentials.password !== foundUser.password) {
  //     throw new HttpErrors.Unauthorized('The password is not correct.');
  //   }

  //   return foundUser;
  // }

  async lookupUser(request: Request) {

    //const user = this.userRepository.find(credentials.username);
    console.log(request.headers)



  }

  convertToUserProfile(request: Request): UserProfile {

    let user = {  
        first_name:  "trevor", 
        last_name:  "mozingo",
        username:   "trevormozingo",
        password:   "pigtig55", 
        email:      "trevormozingo@gmail.com",
        phone:      "3609695450"
      };

    return this.userProfileFactory(user);
  }
}