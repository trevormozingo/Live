import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {VideoDataSource} from '../datasources';
import {Video, VideoRelations} from '../models';

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
