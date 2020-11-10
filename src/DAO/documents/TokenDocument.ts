import { Document, Types } from 'mongoose';

export interface TokenDocument extends Document {
  userId: Types.ObjectId;
  deviceName: string;
  createDate: Date;
  type: string;
  value: string;
}
