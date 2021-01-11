import jwt from 'jsonwebtoken';
import { UserDocument } from '../DAO/documents/UserDocument';
import config from '../config';
import { Token } from '../DAO/models/TokenModel';
import { TokenDocument } from '../DAO/documents/TokenDocument';
import ApplicationError from '../service/ApplicationError';
import * as MongoConverter from '../service/MongoConverter';

export const create = async (
  user: UserDocument,
  deviceName: string,
): Promise<string> => {
  const userData = MongoConverter.fromUser(user);
  let token: string;
  try {
    token = jwt.sign({ user: userData, deviceName }, config.JwtSecret, {
      expiresIn: '24h',
    });
  } catch (error) {
    throw new ApplicationError(
      'Failed to sign token',
      ApplicationError.BAD_REQUEST.code,
    );
  }
  const tokenDocument: TokenDocument = {
    userId: user.id,
    deviceName: deviceName,
    createDate: new Date(),
    type: 'authorization',
    value: token,
  } as TokenDocument;
  const result = await Token.createToken(tokenDocument);
  if (result) {
    return result.value;
  }
  throw new ApplicationError(
    'Failed to create token',
    ApplicationError.BAD_REQUEST.code,
  );
};

export const remove = async (
  userId: string,
  deviceName: string,
): Promise<boolean> => {
  try {
    const result = await Token.removeTokens(userId, deviceName);
    if (result.n && result.ok && result.deletedCount) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const getUserIdFromPayload = (
  payload: string | Record<string, unknown>,
): string => {
  return ((payload as any).user as UserDocument).id;
};

export const getDeviceNameFromPayload = (
  payload: string | Record<string, unknown>,
): string => {
  return (payload as any).deviceName;
};
