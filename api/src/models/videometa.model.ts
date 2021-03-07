import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Videometa extends Entity {
  @property({
    type: 'string',
    required: true,
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
    required: true,
  })
  description: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Videometa>) {
    super(data);
  }
}

export interface VideometaRelations {
  // describe navigational properties here
}

export type VideometaWithRelations = Videometa & VideometaRelations;
