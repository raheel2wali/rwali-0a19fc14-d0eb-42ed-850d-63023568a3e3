import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { TaskDto, JwtUser, Role } from '@rwali-0a19fc14-d0eb-42ed-850d-63023568a3e3/data';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private tasks: Repository<Task>,
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Organization) private orgs: Repository<Organization>,
  ) {}

  async create(dto: TaskDto, user: JwtUser) {
    if (!user.orgId) throw new ForbiddenException('No org');
    const owner = await this.users.findOneByOrFail({ id: user.id });
    const org = await this.orgs.findOneByOrFail({ id: user.orgId });
    const t = this.tasks.create({ title: dto.title, description: dto.description, owner, org });
    return this.tasks.save(t);
  }

  async list(user: JwtUser) {
    if (!user.orgId) return [];
    // Scope: org-level visibility (simple equality; Owner/Admin may see all in org)
    return this.tasks.find({
      where: { org: { id: user.orgId } },
      relations: ['owner', 'org'],
      order: { createdAt: 'DESC' },
    });
  }

  async byIdForOrg(id: string, orgId: string) {
    const t = await this.tasks.findOne({ where: { id }, relations: ['owner', 'org'] });
    if (!t) throw new NotFoundException('Task not found');
    if (t.org.id !== orgId) throw new ForbiddenException('Cross-org access denied');
    return t;
  }

  async update(id: string, dto: TaskDto, user: JwtUser) {
    const t = await this.byIdForOrg(id, user.orgId!);
    // Viewer cannot update; Admin/Owner can; Owner of task can always update
    const canOwner = t.owner.id === user.id;
    const canAdminOrOwnerRole = [Role.Admin, Role.Owner].includes(user.role);
    if (!canOwner && !canAdminOrOwnerRole) throw new ForbiddenException('Not permitted');
    t.title = dto.title ?? t.title;
    t.description = dto.description ?? t.description;
    return this.tasks.save(t);
  }

  async remove(id: string, user: JwtUser) {
    const t = await this.byIdForOrg(id, user.orgId!);
    const canOwner = t.owner.id === user.id;
    const canAdminOrOwnerRole = [Role.Admin, Role.Owner].includes(user.role);
    if (!canOwner && !canAdminOrOwnerRole) throw new ForbiddenException('Not permitted');
    await this.tasks.remove(t);
    return { ok: true };
  }
}
