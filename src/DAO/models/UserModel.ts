import { Model, model } from 'mongoose';
import { UserSchema } from '../schemas/UserSchema';
import { UserDocument } from '../documents/UserDocument';

export interface UserModel extends Model<UserDocument> {
  createUser(user: UserDocument): Promise<UserDocument>;
  getByEmailOrLogin(login: string): Promise<UserDocument>;
  getByEmailAndLogin(email: string, login: string): Promise<UserDocument>;
  removeById(id: number): Promise<UserDocument>;
}

export const User: UserModel = model<UserDocument, UserModel>(
  'users',
  UserSchema,
);
