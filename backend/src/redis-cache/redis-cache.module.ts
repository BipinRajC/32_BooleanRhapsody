import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisCacheController } from './redis-cache.controller';
import { RedisCacheService } from './redis-cache.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379',
    }),
    DatabaseModule,
  ],
  controllers: [RedisCacheController],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
