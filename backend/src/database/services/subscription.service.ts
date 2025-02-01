import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { subscription } from '../schemas/subscription.schema';
import { repositoryBranchSHA } from '../schemas/repositoryBranchSHA.schema';

@Injectable()
export class subscriptionDatabaseService {
  constructor(
    @InjectModel('Subscription')
    private sub: Model<subscription>,
  ) {}

  async createSubscription(sub: subscription): Promise<subscription> {
    const createdSubscription = new this.sub(sub);
    return await createdSubscription.save();
  }

  async getUniqueRepositories(): Promise<repositoryBranchSHA[]> {
    return this.sub
      .aggregate([
        {
          $group: {
            _id: {
              repository: '$repository',
              branch: '$branch',
            },
            // Collect the most recent SHA for this repository-branch combination
            latestSHA: { $last: '$SHA' },
          },
        },
        {
          $project: {
            _id: 0, // Exclude the _id field from the result
            repository: '$_id.repository',
            branch: '$_id.branch',
            SHA: '$latestSHA', // Include the latest SHA
          },
        },
      ])
      .exec();
  }
  async getUsersForRepository(repo: string): Promise<subscription[]> {
    return this.sub.find({ repository: repo }).exec();
  }

  async getAllSubscriptions(): Promise<subscription[]> {
    return this.sub.find().exec();
  }

  async getUsersRepositoryAndBranches(email: string): Promise<subscription[]> {
    return await this.sub.find({ email }).exec();
  }

  async unsubscribe(
    email: string,
    repository: string,
    branch: string,
  ): Promise<any> {
    return await this.sub.deleteOne({ email, repository, branch }).exec();
  }
}
