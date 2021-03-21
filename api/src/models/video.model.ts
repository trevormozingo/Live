import {Entity, model, belongsTo, property, hasMany} from '@loopback/repository';
import {User} from './user.model';

@model({settings: {strict: true, hiddenProperties: ['userId', 'file']}})
export class Video extends Entity {
  @property({
    type: 'string',
    required: false,
  })
  name: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: false,
  })
  description: string;

  @property({
    type: 'date',
    required: false,
  })
  date: string;

  @property({
    type: 'string',
  })
  userId?: string;

  @property({
    type: 'Object',
    required: true,
  })
  file: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Video>) {
    super(data);
  }
}

export interface VideoRelations {
  // describe navigational properties here
}

export type VideoWithRelations = Video & VideoRelations;
