import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
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
import { MetaResponse } from 'src/response/meta-dto';
import { MailService } from 'src/mail/mail.service';
import { Gender } from 'src/enums/enum';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class EmployeeService {
  private readonly logger = new Logger(EmployeeService.name);
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}
  async create(createEmployeeDto: CreateEmployeeDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const existingEmail = await this.employeeRepository.findOne({
        where: { email: createEmployeeDto.email },
      });
      const existingUsername = await this.userRepository.findOne({
        where: { username: createEmployeeDto.username },
      });

      if (existingEmail) {
        throw new BadRequestException('Email sudah digunakan.');
      }
      if (existingUsername) {
        throw new BadRequestException('Username sudah digunakan.');
      }
      const employee = this.employeeRepository.create(createEmployeeDto);
      const savedEmployee = await queryRunner.manager.save(employee);
      const passwordDefault = this.generateRandomPassword();
      const newUser: CreateUserDto = {
        username: createEmployeeDto.username,
        email: createEmployeeDto.email,
        password: passwordDefault,
        role: createEmployeeDto.role,
        isActive: false,
        isDefault: true,
        employee: savedEmployee,
      };
      const sayHello = createEmployeeDto.gender == Gender.MALE ? 'Mr' : 'Mrs';
      const variableEmails: any = {
        sayHello: sayHello,
        name: createEmployeeDto.name,
        email: createEmployeeDto.username,
        password: passwordDefault,
      };
      await this.mailService.sendMail(
        createEmployeeDto.email,
        'Selamat Datang di PT. XXX',
        variableEmails,
      );

      this.userService.create(newUser);
      return savedEmployee;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      if (error.response?.statusCode === 400) {
        throw new BadRequestException(error.response.message);
      } else {
        throw new InternalServerErrorException('Terjadi Kesalahan pada server');
      }
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(query: FindAllEmployeesDto): Promise<any> {
    const { page, size, direction, sortBy, search } = query;

    try {
      const skip = (page - 1) * size;
      const take = size;

      const whereOptions = search
        ? {
            name: Like(`%${search}%`),
          }
        : {};

      // Query untuk data yang dipaginasi
      const [employees, total] = await this.employeeRepository.findAndCount({
        relations: ['position'],
        where: whereOptions,
        order: {
          [sortBy]: direction,
        },
        skip,
        take,
      });

      // Data kosong dengan metadata pagination
      const pagination: MetaResponse = {
        status: 'success',
        message: 'Successfully request',
        timestamp: new Date(),
        page,
        limit: size,
        totalPages: Math.ceil(total / size),
        totalItems: total,
      };

      // Jika data kosong
      const response: any = {
        pagination,
        data: employees.length > 0 ? employees : [], // Menyediakan data kosong jika tidak ada item
      };

      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          {
            status: 'error',
            message: 'Terjadi kesalahan pada server',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
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

  generateRandomPassword(length: number = 8): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
