import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtUser, Role, RegisterDto  } from '@rwali-0a19fc14-d0eb-42ed-850d-63023568a3e3/data';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Organization) private orgs: Repository<Organization>,
    private jwt: JwtService,
  ) {}

  // async register(email: string, password: string, orgId?: string) {
  async register(dto: RegisterDto) {
    const { email, password, orgId, role } = dto;

    const existing = await this.users.findOne({ where: { email } });
    if (existing) throw new BadRequestException('Email in use');

    const passwordHash = await bcrypt.hash(password, 10);
    let org: Organization | null = null;

    if (orgId) {
      org = await this.orgs.findOne({ where: { id: orgId } });
      if (!org) throw new BadRequestException('Invalid org');
    } else {
      // default: create personal org root
      org = this.orgs.create({ name: `org-${email}-${uuid().slice(0, 8)}` });
      await this.orgs.save(org);
    }

    let finalRole: Role;

    if (!role) {
    // agar role nahi diya, default Owner
    finalRole = Role.Owner;
    } else if ([Role.Viewer, Role.Admin, Role.Owner].includes(role)) {
      finalRole = role;
    } else {
      throw new BadRequestException('Invalid role');
    }

    // const user = this.users.create({ email, passwordHash, org, role: 'owner' });
    const user = this.users.create({ email, passwordHash, org, role: finalRole });
    await this.users.save(user);
    return this.sign(user);
  }

  async login(email: string, password: string) {
    const user = await this.users.findOne({ where: { email }, relations: ['org'] });
    if (!user) throw new BadRequestException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new BadRequestException('Invalid credentials');
    return this.sign(user);
  }

  private sign(user: User) {
    const payload: JwtUser = {
      id: user.id,
      email: user.email,
      orgId: user.org?.id ?? null,
      role: user.role as Role,
    };
    const token = this.jwt.sign(payload);
    return { token, user: payload };
  }
}
