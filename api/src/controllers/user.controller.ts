import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/context';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {UserProfile} from '@loopback/security';
import {SecurityBindings} from '@loopback/security';
import {authenticate, TokenService} from '@loopback/authentication';
import {UserAuthenticationBindings} from '../keys';
import {UserAuthenticationService} from '../services/user-auth-service';
import {RestBindings, Request, HttpErrors} from '@loopback/rest';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository : UserRepository,

    @inject(RestBindings.Http.REQUEST)
    private request: Request,

    @inject(SecurityBindings.USER, {optional:true})
    private userProfile: UserProfile,

    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,

    @inject(UserAuthenticationBindings.USER_SERVICE)
    private userService: UserAuthenticationService,
  ) {}

  @post('/users')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',

          }),
        },
      },
    })
    user: User,
  ): Promise<User> {
    const conflictError = "username already in use."
    const user_found = await this.userRepository.findOne({
      where: {username: user.username},
    });

    if (user_found) {
      throw new HttpErrors.Conflict(conflictError);
    }

    // NEED TO ADD INPUT VALIDATION HERE

    const secured_user = this.userService.secureUser(user);
    return this.userRepository.create(secured_user);
  }

  @post('/users/login')
  @response(200, {
    description: 'Authentication Token',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {exclude: ['first_name', 'last_name', 'email', 'phone']}),
        },
      },
    })
    user: User,
  ): Promise<{token: string}>  {
    const invalidCredentialsError = 'Invalid username or password.';

    const user_found = await this.userRepository.findOne({
      where: {username: user.username},
    });

    if (!user_found) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const verified = this.userService.verifyUser(user, user_found);

    if (!verified) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const user_profile = this.userService.convertToUserProfile(user_found);
    const token = await this.jwtService.generateToken(user_profile);

    return {token};
  }

  @authenticate('jwt')
  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true, exclude: ['password', 'email', 'phone']}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
  ): Promise<User> {
    return this.userRepository.findById(id);
  }

  // @authenticate('user')
  // @get('/users/count')
  // @response(200, {
  //   description: 'User model count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async count(
  //   @param.where(User) where?: Where<User>,
  // ): Promise<Count> {
  //   return this.userRepository.count(where);
  // }

  // @authenticate('user')
  // @get('/users')
  // @response(200, {
  //   description: 'Array of User model instances',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'array',
  //         items: getModelSchemaRef(User, {includeRelations: true}),
  //       },
  //     },
  //   },
  // })
  // async find(
  //   @param.filter(User) filter?: Filter<User>,
  // ): Promise<User[]> {
  //   return this.userRepository.find(filter);
  // }

  // @authenticate('user')
  // @patch('/users')
  // @response(200, {
  //   description: 'User PATCH success count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(User, {partial: true}),
  //       },
  //     },
  //   })
  //   user: User,
  //   @param.where(User) where?: Where<User>,
  // ): Promise<Count> {
  //   return this.userRepository.updateAll(user, where);
  // }

  // @authenticate('user')
  // @get('/users/{id}')
  // @response(200, {
  //   description: 'User model instance',
  //   content: {
  //     'application/json': {
  //       schema: getModelSchemaRef(User, {includeRelations: true}),
  //     },
  //   },
  // })
  // async findById(
  //   @param.path.string('id') id: string,
  //   @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  // ): Promise<User> {
  //   return this.userRepository.findById(id, filter);
  // }

  // @authenticate('user')
  // @patch('/users/{id}')
  // @response(204, {
  //   description: 'User PATCH success',
  // })
  // async updateById(
  //   @param.path.string('id') id: string,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(User, {partial: true}),
  //       },
  //     },
  //   })
  //   user: User,
  // ): Promise<void> {
  //   await this.userRepository.updateById(id, user);
  // }

  // @authenticate('user')
  // @put('/users/{id}')
  // @response(204, {
  //   description: 'User PUT success',
  // })
  // async replaceById(
  //   @param.path.string('id') id: string,
  //   @requestBody() user: User,
  // ): Promise<void> {
  //   await this.userRepository.replaceById(id, user);
  // }

  @authenticate('jwt')
  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    var token = this.request.headers.authorization;

    if (!token) {
      throw new HttpErrors.Unauthorized("Invalid acccess token.");
    }

    var username = this.userService.usernameFromToken(token);

    if (username !== id) {
      throw new HttpErrors.Unauthorized("Unauthorized to modify this resource.");
    }
    
    // Expire credentials

    await this.userRepository.deleteById(id);
  }

}
