import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Position } from './entities/position.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
  ) {}
  create(createPositionDto: CreatePositionDto) {
    const position = this.positionRepository.create(createPositionDto);
    return this.positionRepository.save(position);
  }

  findAll() {
    return this.positionRepository.find();
  }

  async findOne(id: number) {
    const position = await this.positionRepository.findOne({
      where: { id },
      relations: ['allowences'],
    });
    if (!position) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
    return position;
  }

  async update(id: number, updatePositionDto: UpdatePositionDto) {
    const existingPosition = await this.positionRepository.findOne({
      where: { id },
    });
    if (!existingPosition) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
    await this.positionRepository.update(id, updatePositionDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const existingPosition = await this.positionRepository.findOne({
      where: { id },
    });
    if (!existingPosition) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
    await this.positionRepository.remove(existingPosition);
  }
}
