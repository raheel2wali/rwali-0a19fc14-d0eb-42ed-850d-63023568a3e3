import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { CreateUserDto, UpdateUserRoleDto, UserSummary, JwtUser, Role } from '@rwali-0a19fc14-d0eb-42ed-850d-63023568a3e3/data';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Organization) private orgs: Repository<Organization>,
  ) {}

  async listForOrg(current: JwtUser): Promise<UserSummary[]> {
    if (!current.orgId) throw new ForbiddenException('No org');
    const list = await this.users.find({
      where: { org: { id: current.orgId } },
      relations: ['org'],
      order: { email: 'ASC' },
    });
    return list.map(u => ({
      id: u.id,
      email: u.email,
      role: u.role as Role,
      orgId: u.org?.id ?? null,
      orgName: u.org?.name,
    }));
  }

  async createForOrg(dto: CreateUserDto, current: JwtUser): Promise<UserSummary> {
    if (!current.orgId) throw new ForbiddenException('No org');
    if (![Role.Owner, Role.Admin].includes(current.role)) {
      throw new ForbiddenException('Only owner/admin can create users');
    }

    const existing = await this.users.findOne({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email in use');

    const org = await this.orgs.findOne({ where: { id: dto.orgId ?? current.orgId } });
    if (!org) throw new BadRequestException('Invalid org');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.users.create({
      email: dto.email,
      passwordHash,
      org,
      role: dto.role,
    });

    await this.users.save(user);

    return {
      id: user.id,
      email: user.email,
      role: user.role as Role,
      orgId: org.id,
      orgName: org.name,
    };
  }

  async updateRole(id: string, dto: UpdateUserRoleDto, current: JwtUser): Promise<UserSummary> {
    if (!current.orgId) throw new ForbiddenException('No org');
    if (current.role !== Role.Owner) {
      throw new ForbiddenException('Only owner can change roles');
    }

    const user = await this.users.findOne({ where: { id }, relations: ['org'] });
    if (!user) throw new BadRequestException('User not found');
    if (user.org?.id !== current.orgId) {
      throw new ForbiddenException('Cross-org update not allowed');
    }

    user.role = dto.role;
    await this.users.save(user);

    return {
      id: user.id,
      email: user.email,
      role: user.role as Role,
      orgId: user.org?.id ?? null,
      orgName: user.org?.name,
    };
  }

  async me(current: JwtUser): Promise<UserSummary> {
    const user = await this.users.findOne({ where: { id: current.id }, relations: ['org'] });
    return {
      id: user.id,
      email: user.email,
      role: user.role as Role,
      orgId: user.org?.id ?? null,
      orgName: user.org?.name,
    };
  }
}
