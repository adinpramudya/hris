import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Allowance } from 'src/allowance/entities/allowance.entity';
import { EmployeeType, Gender, MaritalStatus } from 'src/enums/enum';
import { Position } from 'src/position/entities/position.entity';
import { Role } from 'src/role/entities/role.entity';
import { IsPeriodeOutDateRequired } from 'src/validations/is-periode-out-date-required.validator';

export class CreateEmployeeDto {
  @IsNotEmpty({ message: 'Nama lengkap tidak boleh kosong' })
  name: string;
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  username: string;
  @IsNotEmpty({ message: 'Tempat lahir tidak boleh kosong' })
  placeOfBirth: string;
  @IsNotEmpty({ message: 'Tanggal lahir tidak boleh kosong' })
  dateOfBirth: Date;
  @IsEmail()
  email: string;
  @IsNotEmpty({ message: 'Jenis kelamin tidak boleh kosong' })
  @IsEnum(Gender, {
    message: 'Jenis kelamin harus salah satu dari nilai berikut: MALE, FEMALE',
  })
  gender: Gender;
  rekeningNumber: string;
  @IsNotEmpty({ message: 'Alamat tidak boleh kosong' })
  address: string;
  @IsNotEmpty({ message: 'Cuti tidak boleh kosong' })
  @IsInt()
  @Min(0)
  @Max(12)
  paidLeave: number;
  @IsNotEmpty({ message: 'Posisi tidak boleh kosong' })
  position: Position;
  // @IsNotEmpty({ message: 'Password Tidak boleh kosong' })
  // @MinLength(8, { message: 'Minimal 8 karakter' })
  // password: string;
  @IsNotEmpty({ message: 'Role Tidak boleh kosong' })
  role: Role;
  @IsNotEmpty({ message: 'Type karyawan tidak boleh kosong' })
  @IsEnum(EmployeeType)
  employeeType: EmployeeType;
  allowences: Allowance[];
  @IsNotEmpty({ message: 'NIK tidak boleh kosong' })
  @MinLength(16, { message: 'NIK Harus berisi 16 angka' })
  @MaxLength(16, { message: 'NIK Harus berisi 16 angka' })
  nik: string;
  @IsNotEmpty({ message: 'Status Pernikahan tidak boleh kosong' })
  @IsEnum(MaritalStatus, {
    message:
      'Status Perkawinan harus salah satu dari nilai berikut: MARRIED, SINGLE',
  })
  maritalStatus: MaritalStatus;
  @IsNotEmpty({ message: 'Tanggal Masuk tidak boleh kosong' })
  dateOfEntry: Date;
  @IsOptional()
  @IsInt()
  numberOfChildren: number;
  @IsNotEmpty({ message: 'NPWP tidak boleh kosong' })
  npwp: string;

  @IsNotEmpty({ message: 'Gaji Pokok tidak boleh kosong' })
  salaryBasic: number;

  @IsPeriodeOutDateRequired()
  periodeEndDate: Date;
}
