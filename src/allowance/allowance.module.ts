import { Module } from '@nestjs/common';
import { AllowanceService } from './allowance.service';
import { AllowanceController } from './allowance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Allowance } from './entities/allowance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Allowance])],
  controllers: [AllowanceController],
  providers: [AllowanceService],
})
export class AllowanceModule {}
