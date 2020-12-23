import { Document, Types } from 'mongoose';

export interface CategoryDocument extends Document {
  text: string;
  color?: string;
  icon?: string;
  userId: Types.ObjectId;
}
