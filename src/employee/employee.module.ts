import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { UserModule } from 'src/user/user.module';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, User]), UserModule],
  controllers: [EmployeeController],
  providers: [EmployeeService, MailService],
})
export class EmployeeModule {}
