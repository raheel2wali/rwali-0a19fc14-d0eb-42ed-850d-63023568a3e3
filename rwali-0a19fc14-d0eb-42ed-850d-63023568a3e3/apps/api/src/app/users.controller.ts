import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard, RbacGuard, CurrentUser } from '@rwali-0a19fc14-d0eb-42ed-850d-63023568a3e3/auth';
import { JwtUser, Permission, Role, CreateUserDto, UpdateUserRoleDto } from '@rwali-0a19fc14-d0eb-42ed-850d-63023568a3e3/data';
import { Permissions, Roles } from '@rwali-0a19fc14-d0eb-42ed-850d-63023568a3e3/auth';

@Controller('users')
@UseGuards(JwtAuthGuard, RbacGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: JwtUser) {
    return this.users.me(user);
  }

  @Get()
  @Roles(Role.Owner, Role.Admin)
  list(@CurrentUser() user: JwtUser) {
    return this.users.listForOrg(user);
  }

  @Post()
  @Roles(Role.Owner, Role.Admin)
  create(@Body() dto: CreateUserDto, @CurrentUser() user: JwtUser) {
    return this.users.createForOrg(dto, user);
  }

  @Put(':id/role')
  @Roles(Role.Owner)
  updateRole(@Param('id') id: string, @Body() dto: UpdateUserRoleDto, @CurrentUser() user: JwtUser) {
    return this.users.updateRole(id, dto, user);
  }
}
