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

  create(data: CreateDto): Entity {
    return {
      id: this.storage.length,
      createdAt: new Date(),
      updatedAt: null,
      isDeleted: false,
      ...data,
    } as unknown as Entity;
  }

  save(entity: Entity) {
    this.storage.push(entity);
    return entity;
  }

  find(params?: FindManyOptions<Entity>): Entity[] {
    return this.storage.filter((entity) => {
      // iterate over params.where object attributes
      for (const key in params.where) {
        if (entity[key] !== params.where[key]) {
          return false;
        }
      }

      return true;
    });
  }
}
