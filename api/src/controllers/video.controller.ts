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
import {Videometa} from '../models';
import {VideometaRepository} from '../repositories';

export class VideoController {
  constructor(
    @repository(VideometaRepository)
    public videometaRepository : VideometaRepository,
  ) {}

  @post('/videometas')
  @response(200, {
    description: 'Videometa model instance',
    content: {'application/json': {schema: getModelSchemaRef(Videometa)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Videometa, {
            title: 'NewVideometa',
            exclude: ['id'],
          }),
        },
      },
    })
    videometa: Omit<Videometa, 'id'>,
  ): Promise<Videometa> {
    return this.videometaRepository.create(videometa);
  }

  @get('/videometas/count')
  @response(200, {
    description: 'Videometa model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Videometa) where?: Where<Videometa>,
  ): Promise<Count> {
    return this.videometaRepository.count(where);
  }

  @get('/videometas')
  @response(200, {
    description: 'Array of Videometa model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Videometa, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Videometa) filter?: Filter<Videometa>,
  ): Promise<Videometa[]> {
    return this.videometaRepository.find(filter);
  }

  @patch('/videometas')
  @response(200, {
    description: 'Videometa PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Videometa, {partial: true}),
        },
      },
    })
    videometa: Videometa,
    @param.where(Videometa) where?: Where<Videometa>,
  ): Promise<Count> {
    return this.videometaRepository.updateAll(videometa, where);
  }

  @get('/videometas/{id}')
  @response(200, {
    description: 'Videometa model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Videometa, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Videometa, {exclude: 'where'}) filter?: FilterExcludingWhere<Videometa>
  ): Promise<Videometa> {
    return this.videometaRepository.findById(id, filter);
  }

  @patch('/videometas/{id}')
  @response(204, {
    description: 'Videometa PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Videometa, {partial: true}),
        },
      },
    })
    videometa: Videometa,
  ): Promise<void> {
    await this.videometaRepository.updateById(id, videometa);
  }

  @put('/videometas/{id}')
  @response(204, {
    description: 'Videometa PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() videometa: Videometa,
  ): Promise<void> {
    await this.videometaRepository.replaceById(id, videometa);
  }

  @del('/videometas/{id}')
  @response(204, {
    description: 'Videometa DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.videometaRepository.deleteById(id);
  }
}
