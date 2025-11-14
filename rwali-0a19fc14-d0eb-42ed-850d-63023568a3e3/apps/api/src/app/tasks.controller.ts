import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, SetMetadata } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard, RbacGuard } from '@rwali-0a19fc14-d0eb-42ed-850d-63023568a3e3/auth';
import { CurrentUser, OrgScoped, Permissions } from '@rwali-0a19fc14-d0eb-42ed-850d-63023568a3e3/auth';
import { Permission, TaskDto, JwtUser } from '@rwali-0a19fc14-d0eb-42ed-850d-63023568a3e3/data';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RbacGuard)
export class TasksController {
  constructor(private svc: TasksService) {}

  @Post()
  @Permissions(Permission.TASK_CREATE)
  @OrgScoped()
  create(@Body() dto: TaskDto, @CurrentUser() user: JwtUser) {
    return this.svc.create(dto, user);
  }

  @Get()
  @Permissions(Permission.TASK_READ)
  @OrgScoped()
  list(@CurrentUser() user: JwtUser) {
    return this.svc.list(user);
  }

  @Put(':id')
  @Permissions(Permission.TASK_UPDATE)
  @OrgScoped()
  update(@Param('id') id: string, @Body() dto: TaskDto, @CurrentUser() user: JwtUser, @Req() req: any) {
    req.orgIdChecked = user.orgId; // used by guard; here same org
    return this.svc.update(id, dto, user);
  }

  @Delete(':id')
  @Permissions(Permission.TASK_DELETE)
  @OrgScoped()
  remove(@Param('id') id: string, @CurrentUser() user: JwtUser, @Req() req: any) {
    req.orgIdChecked = user.orgId;
    return this.svc.remove(id, user);
  }
}
