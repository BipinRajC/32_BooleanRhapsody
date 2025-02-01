import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { DatabaseModule } from 'src/database/database.module';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  imports: [DatabaseModule, RedisCacheModule],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
