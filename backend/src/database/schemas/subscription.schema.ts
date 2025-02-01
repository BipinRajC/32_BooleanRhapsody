import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class subscription {
  @Prop()
  email: string;

  @Prop()
  repository: string;

  @Prop()
  branch: string;

  @Prop()
  subscriptionType: string;

  @Prop()
  customPrompt: string;
}

export const subscriptionSchema = SchemaFactory.createForClass(subscription);
