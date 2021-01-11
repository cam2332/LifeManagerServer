import { model, Model } from 'mongoose';
import { TokenSchema } from '../schemas/TokenSchema';
import { TokenDocument } from '../documents/TokenDocument';

export interface TokenModel extends Model<TokenDocument> {
  createToken(token: TokenDocument): Promise<TokenDocument>;
  removeTokens(
    userId: string,
    deviceName: string,
  ): Promise<{
    ok?: number | undefined;
    n?: number | undefined;
    deletedCount?: number | undefined;
  }>;
}

export const Token: TokenModel = model<TokenDocument, TokenModel>(
  'tokens',
  TokenSchema,
);
