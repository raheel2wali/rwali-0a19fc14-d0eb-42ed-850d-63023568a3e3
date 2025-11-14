// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from '../typeorm';
import { User } from '../entities/user.entity';
import { Task } from '../entities/task.entity';
import { Organization } from '../entities/organization.entity';
import { AuthModule } from './auth.module';
import { TasksModule } from './tasks.module';
import { AuditModule } from './audit.module';
import { UsersModule } from './users.module';
import { OrgModule } from './org.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options as any),
    TypeOrmModule.forFeature([User, Task, Organization]),
    AuthModule,
    TasksModule,
    AuditModule,
    UsersModule,
    OrgModule
  ],
})
export class AppModule {}
