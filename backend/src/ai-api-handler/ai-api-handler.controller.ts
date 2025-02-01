import { Body, Controller, Post } from '@nestjs/common';
import { AiApiHandlerService } from './ai-api-handler.service';

@Controller('ai-api-handler')
export class AiApiHandlerController {
  constructor(private aiService: AiApiHandlerService) {}

  @Post('sendPrompt')
  getSummary(@Body() body: string) {
    console.log('Received Request:', body);
    return this.aiService.getSummaryFromAiModel(
      body['prompt'],
      body['provider'],
    );
  }
}
