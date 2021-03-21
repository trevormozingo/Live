import {inject} from '@loopback/context';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  response,
  Request,
  requestBody,
  HttpErrors
} from '@loopback/rest';
import {
  User,
  Video,
} from '../models';
import {UserRepository, VideoRepository} from '../repositories';
import {FilesDataSource} from '../datasources';
import {authenticate} from '@loopback/authentication';

export class UserVideoController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,

    @inject('datasources.files') 
    public filesDataSource: FilesDataSource,

    @repository(VideoRepository)
    public videoRepository : VideoRepository,
  ) { }

  @authenticate('jwt')
  @post('/users/{id}/videos')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {
      schema: getModelSchemaRef(Video, {
        exclude: ['userId', 'file']
      })
    }}
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.username,

    @requestBody.file()
    request: Request,
  ): Promise<Video> {

    const user_found = await this.userRepository.findOne({
      where: {username: id},
    });

    if (!user_found) {
      throw new HttpErrors.Unauthorized("User does not exist.");
    }

    var connector = this.filesDataSource.connector;

    if (!connector) {
      throw new HttpErrors.InternalServerError();
    }

    var file = await connector.uploadContainerFiles(id, request);

    var new_video = new Video({
      file: file,
    });

    return this.userRepository.videos(id).create(new_video);
  }

  @authenticate('jwt')
  @get('/users/{id}/videos')
  @response(200, {
    description: 'Array of User has many Video',
    content: {
      'application/json': {
        schema: {type: 'array', items: getModelSchemaRef(Video, {
          exclude: ['userId', 'file']
        })},
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
  ): Promise<Video[]> {
    return this.userRepository.videos(id).find();
  }

  // @authenticate('jwt')
  // @patch('/users/{id}/videos', {
  //   responses: {
  //     '200': {
  //       description: 'User.Video PATCH success count',
  //       content: {'application/json': {schema: CountSchema}},
  //     },
  //   },
  // })
  // async patch(
  //   @param.path.string('id') id: string,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Video, {partial: true,
  //           exclude: ['id', 'userId', 'file']
  //         }),
  //       },
  //     },
  //   })
  //   video: Partial<Video>,
  //   @param.query.object('where', getWhereSchemaFor(Video)) where?: Where<Video>,
  // ): Promise<Count> {
  //   return this.userRepository.videos(id).patch(video, where);
  // }

  @authenticate('jwt')
  @patch('/users/{id}/videos/{video_id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async patch(
    @param.path.string('id') id: string,
    @param.path.string('video_id') video_id: string,

    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Video, {partial: true,
            exclude: ['id', 'userId', 'file', 'date']
          }),
        },
      },
    })
    video: Partial<Video>,
  ): Promise<Count> {
    return this.userRepository.videos(id).patch(video);
  }



//   @authenticate('jwt')
//   @del('/users/{id}/videos', {
//     responses: {
//       '200': {
//         description: 'User.Video DELETE success count',
//         content: {'application/json': {schema: CountSchema}},
//       },
//     },
//   })
//   async delete(
//     @param.path.string('id') id: string,
//     @param.query.object('where', getWhereSchemaFor(Video)) where?: Where<Video>,
//   ): Promise<Count> {
//     return this.userRepository.videos(id).delete(where);
//   }
}
