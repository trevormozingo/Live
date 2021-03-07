import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {VideometaDataSource} from '../datasources';
import {Videometa, VideometaRelations} from '../models';

export class VideometaRepository extends DefaultCrudRepository<
  Videometa,
  typeof Videometa.prototype.id,
  VideometaRelations
> {
  constructor(
    @inject('datasources.videometa') dataSource: VideometaDataSource,
  ) {
    super(Videometa, dataSource);
  }
}
