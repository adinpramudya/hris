import { applyDecorators, Controller } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function CustomController() {
  const configService = new ConfigService();
  const path = configService.get<string>('DEFAULT_PATH');
  return applyDecorators(Controller(path));
}
