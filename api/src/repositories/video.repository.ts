import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {VideoDataSource} from '../datasources';
import {Video, VideoRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class VideoRepository extends DefaultCrudRepository<
  Video,
  typeof Video.prototype.id,
  VideoRelations
> {
  constructor(
    @inject('datasources.video') dataSource: VideoDataSource, 
  ) {
    super(Video, dataSource);
  }
}
