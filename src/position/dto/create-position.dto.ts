import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePositionDto {
  @IsNotEmpty({ message: 'Nama Posisi tidak boleh kosong' })
  name: string;
  @IsNotEmpty({ message: 'Gaji Minimal Pokok tidak boleh kosong' })
  @IsNumber()
  salaryBasicMin: number;
  @IsNotEmpty({ message: 'Gaji Maksimal Pokok tidak boleh kosong' })
  @IsNumber()
  salaryBasicMax: number;
  @IsNotEmpty({ message: 'Deskripsi tidak boleh kosong' })
  description: string;
  @IsNotEmpty({ message: 'Posisi Level tidak boleh kosong' })
  positionLevel: string;
}
