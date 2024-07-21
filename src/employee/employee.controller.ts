import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('api/v1')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('employees')
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get('employees')
  findAll() {
    return this.employeeService.findAll();
  }

  @Get('employees/:id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Patch('employees/:id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete('employees/:id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}
