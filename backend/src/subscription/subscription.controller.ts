import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { subscription } from 'src/database/schemas/subscription.schema';
import { repositoryBranchSHA } from 'src/database/schemas/repositoryBranchSHA.schema';

@Controller('subscription')
export class SubscriptionController {
  constructor(private subService: SubscriptionService) {}

  @Post('addSubscription')
  addSubscription(@Body() subObj: subscription): Promise<subscription> {
    return this.subService.createSubscription(subObj);
  }

  @Get('getListOfRepositories')
  getRepositories(): Promise<repositoryBranchSHA[]> {
    return this.subService.getUniqueRepositories();
  }
}
