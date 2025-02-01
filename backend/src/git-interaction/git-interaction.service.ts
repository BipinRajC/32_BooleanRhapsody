import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';
import { repositoryBranchSHA } from 'src/database/schemas/repositoryBranchSHA.schema';
import { repositoryBranchSHADatabaseService } from 'src/database/services/repositoryBranchSHA.service';
import {
  subscription,
  subscriptionSchema,
} from 'src/database/schemas/subscription.schema';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';

@Injectable()
export class GitInteractionService {
  constructor(
    private repoSHADatabaseService: repositoryBranchSHADatabaseService,
    private redisService: RedisCacheService,
  ) {}
  private formatRetrievedCodeToString(patchData: any): string {
    const formattedPatches = patchData.map((patch) => {
      const filename = patch.filename;
      const patchContent =
        typeof patch.content === 'string'
          ? patch.content.replace(/\\n/g, '\n')
          : '';
      return `Filename: ${filename}\nContent:\n${patchContent}`;
    });

    return formattedPatches.join('\n\n');
  }

  private extractOwnerAndRepo(repoUrl: string): {
    owner: string;
    repo: string;
  } {
    if (typeof repoUrl !== 'string') {
      throw new Error('Invalid input: repoUrl must be a string');
    }
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)(\/|$)/);

    if (!match) {
      throw new Error('Invalid GitHub repository URL');
    }
    return { owner: match[1], repo: match[2] };
  }

  private readonly GITHUB_API_URL = 'https://api.github.com/repos';
  private readonly GITHUB_ACCESS_TOKEN = process.env.GIT_ACCESS_TOKEN;

  async getLatestSHAValue(repoUrl: string, branch: string): Promise<string> {
    try {
      console.log(`Fetching latest commit for ${repoUrl} on branch ${branch}`);
      const { owner, repo } = this.extractOwnerAndRepo(repoUrl);

      const response = await axios.get(
        `${this.GITHUB_API_URL}/${owner}/${repo}/commits`,
        {
          headers: {
            Authorization: `token ${this.GITHUB_ACCESS_TOKEN}`,
          },
          params: {
            sha: branch,
            per_page: 1,
          },
        },
      );

      if (!Array.isArray(response.data) || response.data.length === 0) {
        throw new HttpException(
          'No commits found for the specified branch',
          404,
        );
      }

      const latestCommitSha = response.data[0].sha;
      return latestCommitSha;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Unknown error';
      console.error('Error fetching the latest commit:', errorMessage);
      throw new HttpException(
        `Failed to fetch the latest commit: ${errorMessage}`,
        500,
      );
    }
  }
  async getUpdatedCodeFromCommit(
    repoUrl: string,
    commitSha: string,
  ): Promise<any> {
    try {
      const { owner, repo } = this.extractOwnerAndRepo(repoUrl);
      const response = await axios.get(
        `${this.GITHUB_API_URL}/${owner}/${repo}/commits/${commitSha}`,
        {
          headers: {
            Authorization: `token ${this.GITHUB_ACCESS_TOKEN}`,
          },
        },
      );

      const files = response.data.files;

      const updatedFiles = await Promise.all(
        files.map(async (file: any) => {
          if (file.status === 'removed') {
            return {
              filename: file.filename,
              status: file.status,
              additions: file.additions,
              deletions: file.deletions,
              changes: file.changes,
              patch: file.patch,
              content: null,
            };
          }

          const rawContentResponse = await axios.get(file.raw_url);

          return {
            filename: file.filename,
            status: file.status,
            additions: file.additions,
            deletions: file.deletions,
            changes: file.changes,
            patch: file.patch,
            content: rawContentResponse.data,
          };
        }),
      );

      return this.formatRetrievedCodeToString(updatedFiles);
    } catch (error) {
      console.error('Error fetching the commit details:', error);
      throw new HttpException('Failed to fetch the commit details', 500);
    }
  }
  async checkIfNewCommitExists(
    repositories: repositoryBranchSHA[],
  ): Promise<repositoryBranchSHA[]> {
    const updatedRepoSHAs: repositoryBranchSHA[] = [];
    // const existingSHAValues: repositoryBranchSHA[] =
    //   await this.repoSHADatabaseService.getAllRepositorySHA();

    try {
      for (const sub of repositories) {
        const latestSHA = await this.getLatestSHAValue(
          sub.repository,
          sub.branch,
        );
        if (sub.SHA !== latestSHA) {
          console.log(sub.SHA + ' ' + latestSHA);
          sub.SHA = latestSHA;
          updatedRepoSHAs.push(sub);
          await this.repoSHADatabaseService.updateRepositorySHA(sub, latestSHA);
          await this.redisService.updateValue(
            sub.repository,
            sub.branch,
            latestSHA,
          );
        }
      }
    } catch (error) {
      console.error('Error checking for new commits:', error);
    }

    return updatedRepoSHAs;
  }
}
