import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from './entities/user.entity';
import { Task } from './entities/task.entity';
import { Organization } from './entities/organization.entity';

config();

const type = process.env.DB_TYPE ?? 'sqlite';

export const AppDataSource = new DataSource(
  type === 'postgres'
    ? {
        type: 'postgres',
        url: process.env.DB_URL!,
        entities: [User, Task, Organization],
        synchronize: true,
      }
    : {
        type: 'sqlite',
        database: process.env.DB_PATH || './tmp/dev.sqlite',
        entities: [User, Task, Organization],
        synchronize: true,
      },
);
