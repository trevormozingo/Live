import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {inject} from '@loopback/context';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  RestBindings,
  requestBody,
  response,
  Request,
  HttpErrors
} from '@loopback/rest';
import {UserAuthenticationBindings} from '../keys';
import {UserAuthenticationService} from '../services/user-auth-service';
import {authenticate} from '@loopback/authentication';
import {Video} from '../models';
import {VideoRepository} from '../repositories';
import {FilesDataSource} from '../datasources';

export class VideoController {
  constructor(
    @inject(UserAuthenticationBindings.USER_SERVICE)
    private userService: UserAuthenticationService,

    @inject(RestBindings.Http.REQUEST)
    private request: Request,

    @inject('datasources.files') 
    public dataSource: FilesDataSource,

    @repository(VideoRepository)
    public videoRepository : VideoRepository,
  ) {}

  @authenticate('jwt')
  @post('/videos')
  @response(200, {
    description: 'Video model instance',
    content: {'application/json': {schema: getModelSchemaRef(Video)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Video, {
            title: 'NewVideo',
            exclude: ['id', 'data'],
          }),
        },
      },
    })
    video: Omit<Video, 'id'>,
  ): Promise<Video> {
    return this.videoRepository.create(video);
  }

  // @get('/videos/count')
  // @response(200, {
  //   description: 'Video model count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async count(
  //   @param.where(Video) where?: Where<Video>,
  // ): Promise<Count> {
  //   return this.videoRepository.count(where);
  // }

  // @get('/videos')
  // @response(200, {
  //   description: 'Array of Video model instances',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'array',
  //         items: getModelSchemaRef(Video, {includeRelations: true}),
  //       },
  //     },
  //   },
  // })
  // async find(
  //   @param.filter(Video) filter?: Filter<Video>,
  // ): Promise<Video[]> {
  //   return this.videoRepository.find(filter);
  // }

  // @patch('/videos')
  // @response(200, {
  //   description: 'Video PATCH success count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Video, {partial: true}),
  //       },
  //     },
  //   })
  //   video: Video,
  //   @param.where(Video) where?: Where<Video>,
  // ): Promise<Count> {
  //   return this.videoRepository.updateAll(video, where);
  // }

  @authenticate('jwt')
  @get('/videos/{id}')
  @response(200, {
    description: 'Video model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Video, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Video, {exclude: 'where'}) filter?: FilterExcludingWhere<Video>
  ): Promise<Video> {
    return this.videoRepository.findById(id, filter);
  }

  // @patch('/videos/{id}')
  // @response(204, {
  //   description: 'Video PATCH success',
  // })
  // async updateById(
  //   @param.path.string('id') id: string,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Video, {partial: true}),
  //       },
  //     },
  //   })
  //   video: Video,
  // ): Promise<void> {
  //   await this.videoRepository.updateById(id, video);
  // }

  // @put('/videos/{id}')
  // @response(204, {
  //   description: 'Video PUT success',
  // })
  // async replaceById(
  //   @param.path.string('id') id: string,
  //   @requestBody() video: Video,
  // ): Promise<void> {
  //   await this.videoRepository.replaceById(id, video);
  // }

  @authenticate('jwt')
  @del('/videos/{id}')
  @response(204, {
    description: 'Video DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.videoRepository.deleteById(id);
  }






























  
  @authenticate('jwt')
  @post('/videos/{id}/file')
  @response(200, {
    description: 'Video file',
    content: {'application/json': {schema: Object}},
  })
  async upload(
    @requestBody.file()
    request: Request,

    @param.path.string('id') id: string
  ): Promise<Object> {

    var token = this.request.headers.authorization;

    if (!token) {
      throw new HttpErrors.Unauthorized("Invalid acccess token.");
    }

    var username = this.userService.usernameFromToken(token);

    const found_video = await this.videoRepository.findById(id);

    if (!found_video) {
      throw new HttpErrors.Notfound("Video id not found");
    }

    var connector = this.dataSource.connector;

    if (!connector) {
      throw new HttpErrors.InternalServerError();
    }

    return connector.uploadContainerFiles(found_video.id, request);;
  }
}