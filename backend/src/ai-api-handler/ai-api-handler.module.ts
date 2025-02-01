import { Module } from '@nestjs/common';
import { AiApiHandlerController } from './ai-api-handler.controller';
import { AiApiHandlerService } from './ai-api-handler.service';

@Module({
  controllers: [AiApiHandlerController],
  providers: [AiApiHandlerService],
  exports: [AiApiHandlerService],
})
export class AiApiHandlerModule {}
