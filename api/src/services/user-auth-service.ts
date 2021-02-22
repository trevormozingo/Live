import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {AuthenticationBindings, UserProfileFactory} from '@loopback/authentication';
import {UserProfile, securityId} from '@loopback/security';
import {UserRepository} from '../repositories';
import {User} from '../models';

export const UserProfileFactoryFunction: UserProfileFactory<User> = function (user: User,): UserProfile {

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
    public userProfileFactory: UserProfileFactory<User>,
  ) {}

  convertToUserProfile(user: User): UserProfile {
    return this.userProfileFactory(user);
  }
}