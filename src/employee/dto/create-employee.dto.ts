import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Position } from 'src/position/entities/position.entity';
import { Role } from 'src/role/entities/role.entity';

export class CreateEmployeeDto {
  @IsNotEmpty({ message: 'Nama lengkap tidak boleh kosong' })
  name: string;
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  username: string;
  @IsNotEmpty({ message: 'Tempat lahir tidak boleh kosong' })
  placeOfBirth: string;
  @IsNotEmpty({ message: 'Tanggal lahir tidak boleh kosong' })
  // @IsDate({ message: 'Format Tanggal Salah' })
  dateOfBirth: Date;
  @IsEmail()
  email: string;
  @IsNotEmpty({ message: 'Jenis kelamin tidak boleh kosong' })
  gender: string;
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
  @IsNotEmpty({ message: 'Password Tidak boleh kosong' })
  @MinLength(8, { message: 'Minimal 8 karakter' })
  password: string;
  @IsNotEmpty({ message: 'Role Tidak boleh kosong' })
  role: Role;
  @IsNotEmpty({ message: 'Type karyawan tidak boleh kosong' })
  employeeType: string;
}
