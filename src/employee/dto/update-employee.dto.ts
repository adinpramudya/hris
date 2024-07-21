import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';
import { IsDate, IsEmail, IsNotEmpty, IsOptional, Max } from 'class-validator';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @IsOptional()
  @IsNotEmpty({ message: 'Nama lengkap tidak boleh kosong' })
  name: string;
  @IsOptional()
  @IsNotEmpty({ message: 'Tempat lahir tidak boleh kosong' })
  placeOfBirth: string;
  @IsOptional()
  @IsNotEmpty({ message: 'Tanggal lahir tidak boleh kosong' })
  @IsOptional()
  @IsDate({ message: 'Format Tanggal Salah' })
  dateOfBirth: Date;
  @IsOptional()
  @IsEmail()
  email: string;
  @IsOptional()
  @IsNotEmpty({ message: 'Jenis kelamin tidak boleh kosong' })
  gender: string;
  @IsOptional()
  rekeningNumber: string;
  @IsOptional()
  @IsNotEmpty({ message: 'Alamat tidak boleh kosong' })
  address: string;
  @IsOptional()
  @IsNotEmpty({ message: 'Cuti tidak boleh kosong' })
  @IsOptional()
  @Max(12)
  paidLeave: number;
}
