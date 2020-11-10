import { User } from '../DAO/models/UserModel';
import * as TokenManager from './TokenManager';
import * as HashService from '../service/HashService';
import { UserDocument } from '../DAO/documents/UserDocument';
import ApplicationError from '../service/ApplicationError';

const hashPassword = (
  password: string,
): { hashedPassword: string; salt: string } => {
  const salt = HashService.generateSalt();
  return { hashedPassword: HashService.hash(password, salt), salt };
};

export const authenticate = async (
  login: string,
  password: string,
  deviceName: string,
): Promise<string> => {
  const user = await User.getByEmailOrLogin(login);
  if (!user) {
    throw new ApplicationError(
      'User with that email or login does not exist',
      ApplicationError.UNAUTHORIZED.code,
    );
  }
  if (HashService.compare(password, user.password, user.salt)) {
    try {
      const token = await TokenManager.create(user, deviceName);
      return token;
    } catch (error) {
      throw error;
    }
  }
  throw new ApplicationError(
    'Invalid password',
    ApplicationError.UNAUTHORIZED.code,
  );
};

export const register = async (
  userData: UserDocument,
): Promise<UserDocument> => {
  const user = await User.getByEmailAndLogin(userData.email, userData.login);
  if (user) {
    throw new ApplicationError(
      'User with that email or login already exist',
      ApplicationError.CONFLICT.code,
    );
  }
  const { hashedPassword, salt } = await hashPassword(userData.password);
  userData.password = hashedPassword;
  userData.salt = salt;
  const createdUser = await User.createUser(userData);
  return createdUser;
};

export const logout = async (userId: string): Promise<boolean> => {
  return await TokenManager.remove(userId);
};
