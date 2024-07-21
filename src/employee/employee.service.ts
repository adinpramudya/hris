import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly userService: UserService,
  ) {}
  async create(createEmployeeDto: CreateEmployeeDto) {
    const employee = this.employeeRepository.create(createEmployeeDto);
    const savedEmployee = await this.employeeRepository.save(employee);
    const newUser: CreateUserDto = {
      username: createEmployeeDto.username,
      email: createEmployeeDto.email,
      password: createEmployeeDto.password,
      role: createEmployeeDto.role,
      isActive: false,
      employee: savedEmployee,
    };

    this.userService.create(newUser);
    return savedEmployee;
  }

  findAll() {
    return this.employeeRepository.find({
      relations: ['position'],
    });
  }

  async findOne(id: string) {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const existingEmployee = await this.employeeRepository.findOne({
      where: { id },
    });
    if (!existingEmployee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    await this.employeeRepository.update(id, updateEmployeeDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const existingEmployee = await this.employeeRepository.findOne({
      where: { id },
    });
    if (!existingEmployee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    await this.employeeRepository.remove(existingEmployee);
  }
}
