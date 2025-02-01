import { Injectable, OnModuleInit } from '@nestjs/common';
import { AiApiHandlerService } from 'src/ai-api-handler/ai-api-handler.service';
import { repositoryBranchSHA } from 'src/database/schemas/repositoryBranchSHA.schema';
import { GitInteractionService } from 'src/git-interaction/git-interaction.service';
import { MailerService } from 'src/mailer/mailer.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { subscription } from 'src/database/schemas/subscription.schema';
import { repositoryBranchSHADatabaseService } from 'src/database/services/repositoryBranchSHA.service';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';

@Injectable()
export class GenerateCodeSummaryService implements OnModuleInit {
  constructor(
    private subService: SubscriptionService,
    private gitService: GitInteractionService,
    private aiService: AiApiHandlerService,
    private mailService: MailerService,
    private repoDBSHAService: repositoryBranchSHADatabaseService,
    private redisService: RedisCacheService,
  ) {}

  async subscriptionCore(
    repos: repositoryBranchSHA[],
    SHAMap: repositoryBranchSHA[],
    allSubs: subscription[],
  ): Promise<any> {
    for (const repo of repos) {
      const repository: repositoryBranchSHA = SHAMap.find(
        (entry) =>
          entry.repository === repo.repository && entry.branch === repo.branch,
      );
      let managerMailList: string = '';
      let peerDeveloperMailList: string = '';
      let learnerMailList: string = '';
      const customPromptMailList: subscription[] = [];

      for (const sub of allSubs) {
        if (
          sub.subscriptionType == 'Peer Developer' &&
          sub.repository === repo.repository &&
          sub.branch === repo.branch
        ) {
          peerDeveloperMailList += sub.email + ',';
        }
        if (
          sub.subscriptionType == 'Manager' &&
          sub.repository === repo.repository &&
          sub.branch === repo.branch
        ) {
          managerMailList += sub.email + ',';
        }
        if (
          sub.subscriptionType == 'Learner' &&
          sub.repository === repo.repository &&
          sub.branch === repo.branch
        ) {
          learnerMailList += sub.email + ',';
        }
        if (
          sub.subscriptionType == 'Custom' &&
          sub.repository === repo.repository &&
          sub.branch === repo.branch
        ) {
          customPromptMailList.push(sub);
        }
      }

      peerDeveloperMailList = peerDeveloperMailList.slice(0, -1);
      managerMailList = managerMailList.slice(0, -1);
      learnerMailList = learnerMailList.slice(0, -1);

      if (repository) {
        const repoSHA: string = repository.SHA;
        const retrievedCode = await this.gitService.getUpdatedCodeFromCommit(
          repo.repository,
          repoSHA,
        );

        const peerDeveloperPrompt: string =
          this.aiService.generatePeerDeveloperPrompt(retrievedCode);
        const peerDeveloperSummary: string =
          await this.aiService.getSummaryFromAiModel(peerDeveloperPrompt);

        const managerPrompt: string =
          this.aiService.generateManagerPrompt(retrievedCode);
        const managerSummary: string =
          await this.aiService.getSummaryFromAiModel(managerPrompt);

        const learnerPrompt: string =
          this.aiService.generateLearnerPrompt(retrievedCode);
        const learnerSummary: string =
          await this.aiService.getSummaryFromAiModel(learnerPrompt);

        // Check if there are recipients before sending emails
        if (peerDeveloperMailList) {
          await this.mailService.sendMail(
            peerDeveloperSummary,
            peerDeveloperMailList,
          );
        }

        if (managerMailList) {
          await this.mailService.sendMail(managerSummary, managerMailList);
        }

        if (learnerMailList) {
          await this.mailService.sendMail(learnerSummary, learnerMailList);
        }

        for (const sub of customPromptMailList) {
          const prompt = this.aiService.generateCustomPrompt(
            sub.customPrompt,
            retrievedCode,
          );
          const customPromptSummary: string =
            await this.aiService.getSummaryFromAiModel(prompt);
          await this.mailService.sendMail(customPromptSummary, sub.email);
        }
      }
    }
  }

  async fullCycle(): Promise<string> {
    const repos: repositoryBranchSHA[] =
      await this.subService.getUniqueRepositories();
    const link = 'https://github.com/karthik-pv/Emuser';
    const branch = 'main';
    const SHA: string = await this.gitService.getLatestSHAValue(link, branch);
    const code: any = await this.gitService.getUpdatedCodeFromCommit(link, SHA);
    const prompt: string = this.aiService.generatePeerDeveloperPrompt(code);
    const summary: string = await this.aiService.getSummaryFromAiModel(prompt);
    this.mailService.sendMail(summary, 'karthik.pv77@gmail.com');
    return 'successful';
  }

  async subscriptionCycle(): Promise<string> {
    const reposAndBranches: repositoryBranchSHA[] =
      await this.subService.getUniqueRepositories();
    const updatedRepos: repositoryBranchSHA[] =
      await this.gitService.checkIfNewCommitExists(reposAndBranches);
    console.log(updatedRepos);
    const allSubscriptions: subscription[] =
      await this.subService.getAllSubscription();
    const updatedSHAValues: repositoryBranchSHA[] =
      await this.repoDBSHAService.getAllRepositorySHA();
    return await this.subscriptionCore(
      updatedRepos,
      updatedSHAValues,
      allSubscriptions,
    );
  }

  async trialRun(): Promise<string> {
    const repos: repositoryBranchSHA[] =
      await this.subService.getUniqueRepositories();
    const link = 'https://github.com/karthik-pv/Emuser';
    const branch = 'main';
    const SHA: string = await this.gitService.getLatestSHAValue(link, branch);
    const code: any = await this.gitService.getUpdatedCodeFromCommit(link, SHA);
    const prompt: string = this.aiService.generatePeerDeveloperPrompt(code);
    const summary: string = await this.aiService.getSummaryFromAiModel(prompt);
    this.mailService.sendMail(summary, 'karthik.pv77@gmail.com');
    return 'successful';
  }

  private startInterval() {
    this.redisService.clearRedisBeforeMigration();
    this.redisService.migrateRepositoriesToRedis();
    this.subscriptionCycle();
    setInterval(
      () => {
        this.subscriptionCycle();
      },
      2 * 60 * 1000,
    );
  }
  onModuleInit() {
    this.startInterval();
  }
}
