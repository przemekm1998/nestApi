import { FindOptionsWhere, FindManyOptions } from 'typeorm';
import { BaseEntity } from '../common.entity';

export abstract class MockFactory<Entity extends BaseEntity, CreateDto> {
  protected storage: Entity[];

  constructor() {
    this.storage = [];
  }

  findOneBy(
    where: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
  ): Promise<Entity | null> {
    const filteredEntities = this.storage.filter(
      (entity) => entity.id === where['id'],
    );
    return Promise.resolve(filteredEntities[0]);
  }

  abstract create(data: CreateDto): Entity;

  save(entity: Entity) {
    this.storage.push(entity);
    return entity;
  }

  abstract find(params?: FindManyOptions<Entity>): Entity[];
}
