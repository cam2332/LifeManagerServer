import { Document, Types } from 'mongoose';

export interface TaskDocument extends Document {
  title: string;
  categoryId?: Types.ObjectId | undefined;
  favorite: boolean;
  done: boolean;
  note: string;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
  lastEditDate: Date;
  userId: Types.ObjectId;
}
