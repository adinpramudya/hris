import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiResponse } from 'src/common/ApiResponse/api-response';
import { PageableDto } from 'src/common/dto/pageable.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);
    return new ApiResponse<Role>(
      201,
      'Role has been created successfully',
      new Date(),
      await this.roleRepository.save(role),
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

      const [roles, totalData] = await this.roleRepository.findAndCount({
        where: whereOptions,
        order: {
          [sortBy]: direction,
        },
        skip,
        take,
      });

      // Data kosong dengan metadata pagination
      return new ApiResponse<Role[]>(
        200,
        'Data Role berhasil ditemukan',
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
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return new ApiResponse<Role>(
      200,
      'Role has been fetched',
      new Date(),
      role,
    );
  }
  async update(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<ApiResponse<Role>> {
    const existingRole = await this.roleRepository.findOne({ where: { id } });
    if (!existingRole) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    await this.roleRepository.update(id, updateRoleDto);
    const role = await this.roleRepository.findOne({ where: { id: id } });
    return new ApiResponse<Role>(
      200,
      'Role has been fetched',
      new Date(),
      role,
    );
  }
  async remove(id: number) {
    const existingRole = await this.roleRepository.findOne({ where: { id } });
    if (!existingRole) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return new ApiResponse<Role>(
      200,
      'Employee has been deleted successfully',
      new Date(),
      await this.roleRepository.remove(existingRole),
    );
  }
}
