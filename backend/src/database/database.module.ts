import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { subscriptionSchema } from './schemas/subscription.schema';
import { subscriptionDatabaseService } from './services/subscription.service';
import { repositoryBranchSHADatabaseService } from './services/repositoryBranchSHA.service';
import { repositoryBranchSHASchema } from './schemas/repositoryBranchSHA.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'Subscription', schema: subscriptionSchema },
      { name: 'RepositoryBranchSHA', schema: repositoryBranchSHASchema },
    ]),
  ],
  providers: [subscriptionDatabaseService, repositoryBranchSHADatabaseService],
  exports: [subscriptionDatabaseService, repositoryBranchSHADatabaseService],
})
export class DatabaseModule {}
