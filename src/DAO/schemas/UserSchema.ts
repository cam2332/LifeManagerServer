import { Schema } from 'mongoose';
import { UserDocument } from '../documents/UserDocument';
import { User } from '../models/UserModel';

export const UserSchema: Schema = new Schema(
  {
    login: { type: String, required: true },
    email: { type: String, required: true },
    displayName: { type: String, required: false },
    profileImageUrl: { type: String, required: false },
    password: { type: String, required: true },
    salt: { type: String, required: true },
  },
  { versionKey: false, collection: 'users' },
);

UserSchema.statics.createUser = async (
  user: UserDocument,
): Promise<UserDocument> => {
  return await new User(user).save();
};

UserSchema.statics.getByEmailOrLogin = async (
  login: string,
): Promise<UserDocument | null> => {
  const result = await User.findOne({
    $or: [{ login: login }, { email: login }],
  });
  return result;
};

UserSchema.statics.getByEmailAndLogin = async (
  email: string,
  login: string,
): Promise<UserDocument | null> => {
  const result = await User.findOne({
    $or: [{ login: login }, { email: email }],
  });
  return result;
};
