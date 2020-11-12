import { Request, Response, NextFunction } from 'express';
import ApplicationError from '../service/ApplicationError';
import jwt from 'jsonwebtoken';
import config from '../config';
import { UserDocument } from '../DAO/documents/UserDocument';

export const auth = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  try {
    let token =
      request.header('x-access-token') ||
      request.header('Authorization') ||
      request.header('authorization') ||
      request.header('token');

    if (!token) {
      throw new ApplicationError(
        'Access denied. No token provided.',
        ApplicationError.UNAUTHORIZED.code,
      );
    }

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    try {
      const payload = jwt.verify(token, config.JwtSecret);
      /** Put userId from token payload in request for controllers */
      request.userId = (payload as UserDocument).id;
      next();
    } catch (error) {
      throw new ApplicationError(
        'Invalid token.',
        ApplicationError.BAD_REQUEST.code,
      );
    }
  } catch (error) {
    ApplicationError.errorHandler(error, response);
  }
};
