import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisCacheController } from './redis-cache.controller';
import { RedisCacheService } from './redis-cache.service';

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379',
    }),
  ],
  controllers: [RedisCacheController],
  providers: [RedisCacheService],
})
export class RedisCacheModule {}
