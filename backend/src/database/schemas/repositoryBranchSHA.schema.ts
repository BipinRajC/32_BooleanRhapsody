import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class repositoryBranchSHA {
  @Prop()
  repository: string;

  @Prop()
  branch: string;

  @Prop()
  SHA: string;
}

export const repositoryBranchSHASchema =
  SchemaFactory.createForClass(repositoryBranchSHA);
