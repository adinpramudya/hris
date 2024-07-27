import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { DataSource, Like, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { FindAllEmployeesDto } from './dto/find-all-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly userService: UserService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}
  async create(createEmployeeDto: CreateEmployeeDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let savedEmployee = new Employee();
    try {
      const employee = this.employeeRepository.create(createEmployeeDto);
      savedEmployee = await this.employeeRepository.save(employee);
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
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log('ERRORRR ', error);
      throw new InternalServerErrorException('Terjadi Kesalahan pada server');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(query: FindAllEmployeesDto) {
    const { page, size, direction, sortBy, search } = query;

    const skip = (page - 1) * size;
    const take = size;

    const whereOptions = search
      ? {
          name: Like(`%${search}%`),
        }
      : {};

    return this.employeeRepository.find({
      relations: ['position'],
      where: whereOptions,
      order: {
        [sortBy]: direction,
      },
      skip,
      take,
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
