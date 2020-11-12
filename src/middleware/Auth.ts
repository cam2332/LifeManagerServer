import { Request, Response, NextFunction } from 'express';
import ApplicationError from '../service/ApplicationError';
import jwt from 'jsonwebtoken';
import config from '../config';
import * as TokenManager from '../business/TokenManager';

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
      /** Put userId and deviceName from token payload in request for controllers */
      console.log(payload);
      const userId = TokenManager.getUserIdFromPayload(
        payload as Record<string, unknown>,
      );
      const deviceName = TokenManager.getDeviceNameFromPayload(
        payload as Record<string, unknown>,
      );
      request.userId = userId;
      request.deviceName = deviceName;
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
