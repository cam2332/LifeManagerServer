import { Document } from 'mongoose';

export interface UserDocument extends Document {
  login: string;
  email: string;
  displayName?: string;
  profileImageUrl?: string;
  password: string;
  salt: string;
}
