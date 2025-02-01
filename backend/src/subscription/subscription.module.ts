import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  imports: [DatabaseModule],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
