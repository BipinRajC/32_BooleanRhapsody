import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class RedisCacheService {
  constructor(@InjectRedis() private readonly redis: any) {}

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
}
