import { Controller, Get, Version } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  @Version('1')
  @Get()
  @HealthCheck()
  check() {
    return {
      status: 'ok',
    };
  }
}
