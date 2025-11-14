import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { User } from '../entities/user.entity';
import { JwtAuthGuard, RbacGuard, CurrentUser } from '@rwali-0a19fc14-d0eb-42ed-850d-63023568a3e3/auth';
import { JwtUser } from '@rwali-0a19fc14-d0eb-42ed-850d-63023568a3e3/data';

@Controller('org')
@UseGuards(JwtAuthGuard, RbacGuard)
export class OrgController {
  constructor(
    @InjectRepository(Organization) private orgs: Repository<Organization>,
    @InjectRepository(User) private users: Repository<User>,
  ) {}

  @Get('tree')
  async tree(@CurrentUser() user: JwtUser) {
    if (!user.orgId) return null;

    return this.orgs.findOne({
      where: { id: user.orgId },
      relations: ['parent', 'children'],
    });
  }
}
