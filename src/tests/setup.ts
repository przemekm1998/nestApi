import { DataSource } from 'typeorm';
import { UserEntity } from '../users/users.entity';

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  entities: [UserEntity],
});

export const clearDb = async () => {
  const entities = dataSource.entityMetadatas;

  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name); // Get repository
    await repository.clear(); // Clear each entity table's content
  }
};
global.beforeEach(clearDb);
global.beforeAll(async () => {
  await dataSource.initialize();
});
