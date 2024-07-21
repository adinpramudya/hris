import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
// import { CustomController } from 'src/decorators/custom.controller.decorator';

@Controller('api/v1')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('roles')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get('roles')
  findAll() {
    return this.roleService.findAll();
  }

  @Get('roles/:id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Patch('roles/:id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete('roles/:id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
