import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { repositoryBranchSHA } from '../schemas/repositoryBranchSHA.schema';

@Injectable()
export class repositoryBranchSHADatabaseService {
  constructor(
    @InjectModel('RepositoryBranchSHA')
    private repoDBAccess: Model<repositoryBranchSHA>,
  ) {}

  async createRepositorySHA(
    repo: repositoryBranchSHA,
  ): Promise<repositoryBranchSHA> {
    const createdRepoSHA = new this.repoDBAccess(repo);
    return await createdRepoSHA.save();
  }

  async updateRepositorySHA(
    repo: repositoryBranchSHA,
    latestSHA: string,
  ): Promise<repositoryBranchSHA> {
    try {
      const updatedRepo = await this.repoDBAccess.findOneAndUpdate(
        { repository: repo.repository, branch: repo.branch },
        { SHA: latestSHA },
        { new: true, upsert: true },
      );
      console.log(updatedRepo);
      return updatedRepo;
    } catch (error) {
      console.error('Error updating repository SHA:', error);
      throw new Error('Failed to update repository SHA');
    }
  }

  async getUniqueRepositories(): Promise<repositoryBranchSHA[]> {
    return this.repoDBAccess
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
        // Optional: Sort for consistent output
        {
          $sort: {
            repository: 1,
            branch: 1,
          },
        },
      ])
      .exec();
  }

  async getAllRepositorySHA(): Promise<repositoryBranchSHA[]> {
    return await this.repoDBAccess.find().exec();
  }
}
