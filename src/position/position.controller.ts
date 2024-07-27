import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PositionService } from './position.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@UseGuards(RolesGuard)
@Controller('api/v1')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Post('positions')
  @Roles('MIDDLE_MANAGEMENT')
  create(@Body() createPositionDto: CreatePositionDto) {
    return this.positionService.create(createPositionDto);
  }

  @Get('positions')
  @Roles('MIDDLE_MANAGEMENT')
  findAll() {
    return this.positionService.findAll();
  }

  @Get('positions/:id')
  @Roles('MIDDLE_MANAGEMENT')
  findOne(@Param('id') id: string) {
    return this.positionService.findOne(+id);
  }

  @Patch('positions/:id')
  @Roles('MIDDLE_MANAGEMENT')
  update(
    @Param('id') id: string,
    @Body() updatePositionDto: UpdatePositionDto,
  ) {
    return this.positionService.update(+id, updatePositionDto);
  }

  @Delete('positions/:id')
  @Roles('MIDDLE_MANAGEMENT')
  remove(@Param('id') id: string) {
    return this.positionService.remove(+id);
  }
}
