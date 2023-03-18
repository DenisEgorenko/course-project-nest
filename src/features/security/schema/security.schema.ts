import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/// Types

export type SecurityDocument = HydratedDocument<Security>;

export type SecurityStatics = {
  createSecuritySession: (
    ip: string,
    title: string,
    deviceId: string,
    userId: string,
    SecurityModel: Model<SecurityDocument>,
  ) => SecurityDocument;
};

export type SecurityModel = Model<SecurityDocument> & SecurityStatics;

/// Schema
@Schema()
export class Security {
  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  lastActiveDate: Date;

  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  userId: string;

  updateLastActiveDate() {
    this.lastActiveDate = new Date();
  }
}

export const SecuritySchema = SchemaFactory.createForClass(Security);

/// Methods

SecuritySchema.methods.updateLastActiveDate =
  Security.prototype.updateLastActiveDate;

/// Statics

SecuritySchema.statics.createSecuritySession = (
  ip: string,
  title: string,
  deviceId: string,
  userId: string,
  securityModel: SecurityModel,
): SecurityDocument => {
  return new securityModel({
    ip,
    title,
    lastActiveDate: new Date(),
    deviceId,
    userId,
  });
};
