import { Controller, Get } from '@nestjs/common';
import { GenerateCodeSummaryService } from './generate-code-summary.service';

@Controller('generate-code-summary')
export class GenerateCodeSummaryController {
  constructor(private mainService: GenerateCodeSummaryService) {}

  @Get('fullCycle')
  fullCycle() {
    return this.mainService.fullCycle();
  }

  @Get('subscriptionCycle')
  subscriptionCycle() {
    return this.mainService.subscriptionCycle();
  }
}
