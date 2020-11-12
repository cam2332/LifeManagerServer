import { Schema, Types } from 'mongoose';
import { TokenDocument } from '../documents/TokenDocument';
import { Token } from '../models/TokenModel';

export const TokenSchema: Schema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'users', required: true },
    deviceName: { type: String, required: true },
    createDate: { type: Date, required: true },
    type: { type: String, required: true },
    value: { type: String, required: true },
  },
  { versionKey: false, collection: 'tokens' },
);

TokenSchema.statics.createToken = async (
  token: TokenDocument,
): Promise<TokenDocument> => {
  return await new Token(token).save();
};

TokenSchema.statics.getByValue = async (
  tokenValue: string,
): Promise<TokenDocument | null> => {
  const result = await Token.findOne({ value: tokenValue });
  return result;
};

TokenSchema.statics.removeTokens = async (
  userId: string,
  deviceName: string,
): Promise<{
  ok?: number | undefined;
  n?: number | undefined;
  deletedCount?: number | undefined;
}> => {
  return await Token.deleteMany({
    $and: [{ userId: Types.ObjectId(userId) }, { deviceName: deviceName }],
  });
};
