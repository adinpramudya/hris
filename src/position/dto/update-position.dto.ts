import { PartialType } from '@nestjs/mapped-types';
import { CreatePositionDto } from './create-position.dto';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Allowance } from 'src/allowance/entities/allowance.entity';

export class UpdatePositionDto extends PartialType(CreatePositionDto) {
  @IsOptional()
  @IsNotEmpty({ message: 'Nama Posisi tidak boleh kosong' })
  name: string;
  @IsNotEmpty({ message: 'Gaji Pokok tidak boleh kosong' })
  @IsNumber()
  salaryBasic: number;
  @IsOptional()
  allowence: Allowance[];
}
