import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RbacGuard } from '@rwali-0a19fc14-d0eb-42ed-850d-63023568a3e3/auth';
import { Roles } from '@rwali-0a19fc14-d0eb-42ed-850d-63023568a3e3/auth';
import { Role } from '@rwali-0a19fc14-d0eb-42ed-850d-63023568a3e3/data';
import * as fs from 'fs';

@Controller('audit-log')
@UseGuards(JwtAuthGuard, RbacGuard)
export class AuditController {
  @Get()
  @Roles(Role.Owner, Role.Admin)
  get() {
    const p = process.env.AUDIT_LOG_PATH || './tmp/audit.log';
    if (!fs.existsSync(p)) return [];
    const lines = fs.readFileSync(p, 'utf8').trim().split('\n');
    // return last 500 entries max
    return lines.slice(-500).map(l => JSON.parse(l));
  }
}
