import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '../entities/organization.entity';
import { User } from '../entities/user.entity';
import { OrgController } from './org.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, User])],
  controllers: [OrgController],
})
export class OrgModule {}
