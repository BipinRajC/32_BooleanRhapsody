import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { repositoryBranchSHA } from 'src/database/schemas/repositoryBranchSHA.schema';
import { repositoryBranchSHADatabaseService } from 'src/database/services/repositoryBranchSHA.service';

@Injectable()
export class RedisCacheService {
  constructor(
    @InjectRedis() private readonly redis: any,
    private repoDBAccess: repositoryBranchSHADatabaseService,
  ) {}

  async setValue(
    githubUrl: string,
    branch: string,
    sha: string,
  ): Promise<void> {
    const key = `${githubUrl}:${branch}`;
    await this.redis.set(key, sha);
  }

  async getValue(githubUrl: string, branch: string): Promise<string | null> {
    const key = `${githubUrl}:${branch}`;
    return await this.redis.get(key);
  }

  async deleteValue(githubUrl: string, branch: string): Promise<void> {
    const key = `${githubUrl}:${branch}`;
    await this.redis.del(key);
  }

  async getUniqueRepositories(): Promise<repositoryBranchSHA[]> {
    const keys = await this.redis.keys('*:*');

    const uniqueRepositories: repositoryBranchSHA[] = [];
    const processedRepos = new Set<string>();

    for (const key of keys) {
      const lastColonIndex = key.lastIndexOf(':');
      const repository = key.slice(0, lastColonIndex);
      const branch = key.slice(lastColonIndex + 1);

      const repoKey = `${repository}:${branch}`;

      if (!processedRepos.has(repoKey)) {
        const sha = await this.redis.get(key);

        if (sha) {
          const repoEntry: repositoryBranchSHA = {
            repository,
            branch,
            SHA: sha,
          };

          uniqueRepositories.push(repoEntry);
          processedRepos.add(repoKey);
        }
      }
    }

    return uniqueRepositories;
  }

  async migrateRepositoriesToRedis(): Promise<void> {
    try {
      const uniqueRepositories =
        await this.repoDBAccess.getUniqueRepositories();
      let migratedCount = 0;

      for (const repo of uniqueRepositories) {
        try {
          const key = `${repo.repository}:${repo.branch}`;

          await this.redis.set(key, repo.SHA);

          migratedCount++;

          console.log(`Migrated: ${key} -> ${repo.SHA}`);
        } catch (repoError) {
          console.error(
            `Error migrating repository ${repo.repository}:${repo.branch}`,
            repoError,
          );
        }
      }

      console.log(
        `Migration complete. Migrated ${migratedCount} repositories to Redis.`,
      );
    } catch (error) {
      console.error('Error during repository migration:', error);
      throw new Error('Failed to migrate repositories to Redis');
    }
  }

  async clearRedisBeforeMigration(): Promise<void> {
    const keys = await this.redis.keys('*:*');
    if (keys.length > 0) {
      await this.redis.del(...keys);
      console.log(`Cleared ${keys.length} existing keys from Redis`);
    }
  }

  async updateValue(
    githubUrl: string,
    branch: string,
    newSHA: string,
  ): Promise<boolean> {
    try {
      // Check if the key exists
      const existingValue = await this.getValue(githubUrl, branch);

      if (existingValue === null) {
        // If the key doesn't exist, set a new value
        await this.setValue(githubUrl, branch, newSHA);
        console.log(`Created new entry: ${githubUrl}:${branch} -> ${newSHA}`);
        return true;
      }

      // If the key exists and the SHA is different, update it
      if (existingValue !== newSHA) {
        const key = `${githubUrl}:${branch}`;
        await this.redis.set(key, newSHA);

        console.log(`Updated: ${key} from ${existingValue} to ${newSHA}`);
        return true;
      }

      // If the SHA is the same, no update needed
      console.log(`No update required for ${githubUrl}:${branch}`);
      return false;
    } catch (error) {
      console.error(`Error updating value for ${githubUrl}:${branch}`, error);
      throw new Error('Failed to update Redis value');
    }
  }
}
