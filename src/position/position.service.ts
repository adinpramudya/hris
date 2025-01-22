import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Position } from './entities/position.entity';
import { Like, Repository } from 'typeorm';
import { ApiResponse } from 'src/common/ApiResponse/api-response';
import { PageableDto } from 'src/common/dto/pageable.dto';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
  ) {}
  async create(createPositionDto: CreatePositionDto) {
    const position = this.positionRepository.create(createPositionDto);
    return new ApiResponse<Position>(
      201,
      'Position has been created successfully',
      new Date(),
      await this.positionRepository.save(position),
    );
  }

  async findAll(query: PageableDto) {
    const {
      page = 1,
      size = 10,
      direction = 'ASC',
      sortBy = 'id',
      search,
    } = query;

    try {
      const skip = (page - 1) * size;
      const take = size;

      const whereOptions = search
        ? {
            name: Like(`%${search}%`),
          }
        : {};

      const [roles, totalData] = await this.positionRepository.findAndCount({
        where: whereOptions,
        order: {
          [sortBy]: direction,
        },
        skip,
        take,
      });

      // Data kosong dengan metadata pagination
      return new ApiResponse<Position[]>(
        200,
        'Data Position berhasil ditemukan',
        new Date(),
        roles,
        {
          page,
          limit: size,
          totalPage: Math.ceil(totalData / size),
          totalData,
        },
      );
    } catch (error) {
      throw new Error('An error occurred while retrieving reviews');
    }
  }

  async findOne(id: number) {
    const position = await this.positionRepository.findOne({
      where: { id },
    });
    if (!position) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
    return new ApiResponse<Position>(
      200,
      'Position has been fetched',
      new Date(),
      position,
    );
  }

  async update(id: number, updatePositionDto: UpdatePositionDto) {
    const existingPosition = await this.positionRepository.findOne({
      where: { id },
    });
    if (!existingPosition) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
    await this.positionRepository.update(id, updatePositionDto);
    const position = await this.positionRepository.findOne({
      where: { id: id },
    });
    return new ApiResponse<Position>(
      200,
      'Position has been updated',
      new Date(),
      position,
    );
  }

  async remove(id: number) {
    const existingPosition = await this.positionRepository.findOne({
      where: { id },
    });
    if (!existingPosition) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
    return new ApiResponse<Position>(
      200,
      'Position has been removed',
      new Date(),
      await this.positionRepository.remove(existingPosition),
    );
  }
}
