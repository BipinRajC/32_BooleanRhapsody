import { Controller, Post, Get } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';

@Controller('redis-cache')
export class RedisCacheController {
  constructor(private readonly redisCacheService: RedisCacheService) {}

  @Post('setRedis')
  setRedis() {
    this.redisCacheService.setValue(
      'https://github.com/karthik-pv/32_BooleanRhapsody',
      'main',
      '123567',
    );
    return { message: 'SHA value set successfully' };
  }

  @Get('getRedis')
  getRedis() {}
}
