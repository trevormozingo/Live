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

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository : UserRepository,

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
            exclude: ['salt',]
          }),
        },
      },
    })
    user: User,
  ): Promise<User> {

    const secured_user = this.userService.secureUser(user);

    console.log(secured_user)

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
          schema: getModelSchemaRef(User, {exclude: ['first_name', 'last_name', 'salt', 'email', 'phone']}),
        },
      },
    })
    user: User,
  ): Promise<{token: string}>  {

    const user_found = await this.userRepository.findById(user.username);

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
        schema: getModelSchemaRef(User, {includeRelations: true, exclude: ['password', 'salt', 'email', 'phone']}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
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

  // @authenticate('user')
  // @del('/users/{id}')
  // @response(204, {
  //   description: 'User DELETE success',
  // })
  // async deleteById(@param.path.string('id') id: string): Promise<void> {
  //   await this.userRepository.deleteById(id);
  // }
}
