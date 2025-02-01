import { Module } from '@nestjs/common';
import { GenerateCodeSummaryController } from './generate-code-summary.controller';
import { GenerateCodeSummaryService } from './generate-code-summary.service';
import { DatabaseModule } from 'src/database/database.module';
import { GitInteractionModule } from 'src/git-interaction/git-interaction.module';
import { AiApiHandlerModule } from 'src/ai-api-handler/ai-api-handler.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';

@Module({
  controllers: [GenerateCodeSummaryController],
  providers: [GenerateCodeSummaryService],
  imports: [
    DatabaseModule,
    GitInteractionModule,
    AiApiHandlerModule,
    SubscriptionModule,
    MailerModule,
    RedisCacheModule,
  ],
})
export class GenerateCodeSummaryModule {}
