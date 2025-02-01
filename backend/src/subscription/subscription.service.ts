import { Injectable } from '@nestjs/common';
import { subscriptionDatabaseService } from 'src/database/services/subscription.service';
import { repositoryBranchSHADatabaseService } from 'src/database/services/repositoryBranchSHA.service';
import { subscription } from 'src/database/schemas/subscription.schema';
import { repositoryBranchSHA } from 'src/database/schemas/repositoryBranchSHA.schema';

@Injectable()
export class SubscriptionService {
  constructor(
    private subService: subscriptionDatabaseService,
    private repoSHAService: repositoryBranchSHADatabaseService,
  ) {}

  async createSubscription(subObj: subscription): Promise<subscription> {
    this.repoSHAService.createRepositorySHA({
      repository: subObj.repository,
      branch: subObj.branch,
      SHA: '',
    });
    return this.subService.createSubscription(subObj);
  }

  async getUniqueRepositories(): Promise<repositoryBranchSHA[]> {
    return this.repoSHAService.getUniqueRepositories();
  }

  async getUsersSubscribedToRepository(
    repoLink: string,
  ): Promise<subscription[]> {
    return this.getUsersSubscribedToRepository(repoLink);
  }

  async getAllSubscription(): Promise<subscription[]> {
    return await this.subService.getAllSubscriptions();
  }
}
