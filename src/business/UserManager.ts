import { User } from '../DAO/models/UserModel';
import * as TokenManager from './TokenManager';
import * as HashService from '../service/HashService';
import { UserDocument } from '../DAO/documents/UserDocument';
import ApplicationError from '../service/ApplicationError';
import * as MongoConverter from '../service/MongoConverter';

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
): Promise<{
  token: string;
  user: {
    id: string;
    login: string;
    email: string;
    displayName?: string;
    profileImageUrl?: string;
  };
}> => {
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
      const userData = MongoConverter.fromUser(user);
      return { token, user: userData };
    } catch (error) {
      throw error;
    }
  }
  throw new ApplicationError(
    'Invalid password',
    ApplicationError.UNAUTHORIZED.code,
    'password',
  );
};

export const register = async (
  userData: UserDocument,
): Promise<UserDocument> => {
  const user = await User.getByEmailAndLogin(userData.email, userData.login);
  if (user) {
    if (user.email === userData.email && user.login === userData.login) {
      throw new ApplicationError(
        'User with that email and login already exist',
        ApplicationError.CONFLICT.code,
      );
    } else if (user.email === userData.email) {
      throw new ApplicationError(
        'User with that email already exist',
        ApplicationError.CONFLICT.code,
        'email',
      );
    } else if (user.login === userData.login) {
      throw new ApplicationError(
        'User with that login already exist',
        ApplicationError.CONFLICT.code,
        'login',
      );
    }
  }
  const { hashedPassword, salt } = hashPassword(userData.password);
  userData.password = hashedPassword;
  userData.salt = salt;
  const createdUser = await User.createUser(userData);
  return createdUser;
};

export const logout = async (
  userId: string,
  deviceName: string,
): Promise<boolean> => {
  const success = await TokenManager.remove(userId, deviceName);
  if (!success) {
    throw new ApplicationError(
      'Logout failed',
      ApplicationError.NOT_FOUND.code,
    );
  }
  return success;
};
