import { IsNotEmpty, IsNumber } from 'class-validator';
import { Allowance } from 'src/allowance/entities/allowance.entity';

export class CreatePositionDto {
  @IsNotEmpty({ message: 'Nama Posisi tidak boleh kosong' })
  name: string;
  @IsNotEmpty({ message: 'Gaji Pokok tidak boleh kosong' })
  @IsNumber()
  salaryBasic: number;
  allowence: Allowance[];
}
