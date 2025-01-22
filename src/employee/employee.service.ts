import {
  BadRequestException,
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
import { MailService } from 'src/mail/mail.service';
import { Gender } from 'src/enums/enum';
import { User } from 'src/user/entities/user.entity';
import { ApiResponse } from 'src/common/ApiResponse/api-response';

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
      return new ApiResponse<Employee>(
        201,
        'Employee has been created successfully',
        new Date(),
        savedEmployee,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      if (error.response?.statusCode === 400) {
        throw new BadRequestException(error.response.message);
      } else {
        throw new InternalServerErrorException('Something went wrong');
      }
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(query: FindAllEmployeesDto): Promise<any> {
    const {
      page = 1,
      size = 10,
      direction = 'ASC',
      sortBy = 'id',
      search,
    } = query;

    try {
      const skip = (page - 1) * size;
      const take = size;

      const whereOptions = search
        ? {
            name: Like(`%${search}%`),
          }
        : {};

      const [employees, totalData] = await this.employeeRepository.findAndCount(
        {
          relations: ['position'],
          where: whereOptions,
          order: {
            [sortBy]: direction,
          },
          skip,
          take,
        },
      );

      // Data kosong dengan metadata pagination
      return new ApiResponse<Employee[]>(
        200,
        'Data Employee berhasil ditemukan',
        new Date(),
        employees,
        {
          page,
          limit: size,
          totalPage: Math.ceil(totalData / size),
          totalData,
        },
      );
    } catch (error) {
      throw new Error('An error occurred while retrieving reviews');
    }
  }

  async findOne(id: string) {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return new ApiResponse<Employee>(
      200,
      'Employee has been fetched',
      new Date(),
      employee,
    );
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const existingEmployee = await this.employeeRepository.findOne({
      where: { id },
    });
    if (!existingEmployee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    await this.employeeRepository.update(id, updateEmployeeDto);
    const employee = await this.employeeRepository.findOne({
      where: { id: id },
    });
    return new ApiResponse<Employee>(
      200,
      'Employee has been updated',
      new Date(),
      employee,
    );
  }

  async remove(id: string) {
    const existingEmployee = await this.employeeRepository.findOne({
      where: { id },
    });
    if (!existingEmployee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return new ApiResponse<Employee>(
      200,
      'Employee has been deleted successfully',
      new Date(),
      await this.employeeRepository.remove(existingEmployee),
    );
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
