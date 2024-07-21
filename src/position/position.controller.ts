import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PositionService } from './position.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

@Controller('api/v1')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Post('positions')
  create(@Body() createPositionDto: CreatePositionDto) {
    return this.positionService.create(createPositionDto);
  }

  @Get('positions')
  findAll() {
    return this.positionService.findAll();
  }

  @Get('positions/:id')
  findOne(@Param('id') id: string) {
    return this.positionService.findOne(+id);
  }

  @Patch('positions/:id')
  update(
    @Param('id') id: string,
    @Body() updatePositionDto: UpdatePositionDto,
  ) {
    return this.positionService.update(+id, updatePositionDto);
  }

  @Delete('positions/:id')
  remove(@Param('id') id: string) {
    return this.positionService.remove(+id);
  }
}
