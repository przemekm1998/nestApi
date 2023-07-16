import { DataSource } from 'typeorm';
import { UserEntity } from '../users/users.entity';
import { ReportEntity } from '../reports/reports.entity';

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  entities: [UserEntity, ReportEntity],
});

export const clearDb = async () => {
  const entities = dataSource.entityMetadatas;

  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name);
    await repository.delete({});
  }
};

global.beforeEach(clearDb);
global.beforeAll(async () => {
  await dataSource.initialize();
});
