import { Module } from '@nestjs/common';
import { SubscriptionModule } from './subscription/subscription.module';
import { DatabaseModule } from './database/database.module';
import { GitInteractionModule } from './git-interaction/git-interaction.module';
import { AiApiHandlerModule } from './ai-api-handler/ai-api-handler.module';
import { GenerateCodeSummaryModule } from './generate-code-summary/generate-code-summary.module';
import { MailerModule } from './mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
@Module({
  imports: [
    SubscriptionModule,
    DatabaseModule,
    GitInteractionModule,
    AiApiHandlerModule,
    GenerateCodeSummaryModule,
    MailerModule,
    RedisCacheModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
