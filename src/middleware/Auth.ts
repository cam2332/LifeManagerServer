import { Request, Response, NextFunction } from 'express';
import ApplicationError from '../service/ApplicationError';
import jwt from 'jsonwebtoken';
import config from '../config';

export const auth = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
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
    jwt.verify(token, config.JwtSecret);
    next();
  } catch (error) {
    throw new ApplicationError(
      'Invalid token.',
      ApplicationError.BAD_REQUEST.code,
    );
  }
};
