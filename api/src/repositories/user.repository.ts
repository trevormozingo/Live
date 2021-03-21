import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {UserDataSource} from '../datasources';
import {User, UserRelations, Video} from '../models';
import {VideoRepository} from './video.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.username,
  UserRelations
> {

  public readonly videos: HasManyRepositoryFactory<Video, typeof User.prototype.username>;

  constructor(
    @inject('datasources.user') dataSource: UserDataSource, 
    @repository.getter('VideoRepository') protected videoRepositoryGetter: Getter<VideoRepository>,
  ) {
    super(User, dataSource);
    this.videos = this.createHasManyRepositoryFactoryFor('videos', videoRepositoryGetter,);
    this.registerInclusionResolver('videos', this.videos.inclusionResolver);
  }
}
