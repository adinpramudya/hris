import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { FindAllEmployeesDto } from './dto/find-all-employee.dto';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@UseGuards(RolesGuard)
@Controller('api/v1')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('employees')
  @Roles('MIDDLE_MANAGEMENT')
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get('employees')
  @Roles('MIDDLE_MANAGEMENT')
  findAll(@Query() query: FindAllEmployeesDto) {
    return this.employeeService.findAll(query);
  }

  @Get('employees/:id')
  @Roles('MIDDLE_MANAGEMENT')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Patch('employees/:id')
  @Roles('MIDDLE_MANAGEMENT')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete('employees/:id')
  @Roles('MIDDLE_MANAGEMENT')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}
