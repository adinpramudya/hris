import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  Max,
} from 'class-validator';
import { EmployeeType, Gender, MaritalStatus } from 'src/enums/enum';
import { Allowance } from 'src/allowance/entities/allowance.entity';
import { Type } from 'class-transformer';
import { IsPeriodeOutDateRequired } from 'src/validations/is-periode-out-date-required.validator';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @IsOptional()
  name: string;
  @IsOptional()
  placeOfBirth: string;
  @IsOptional()
  @IsOptional()
  dateOfBirth: Date;
  @IsOptional()
  @IsEmail()
  email: string;
  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;
  @IsOptional()
  rekeningNumber: string;
  @IsOptional()
  address: string;
  @IsOptional()
  @IsOptional()
  @Max(12)
  paidLeave: number;
  @IsOptional()
  allowences: Allowance[];
  @IsOptional()
  nik: string;
  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus: MaritalStatus;
  @IsOptional()
  dateOfEntry: Date;
  @IsOptional()
  @IsNumber()
  numberOfChildren: number;
  npwp: string;
  @IsOptional()
  salaryBasic: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @IsPeriodeOutDateRequired()
  periodeEndDate?: Date;

  @IsOptional()
  @IsEnum(EmployeeType)
  employeeType: EmployeeType;
}
