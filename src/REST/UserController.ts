import express, { Router, Request, Response } from 'express';
import * as UserManager from '../business/UserManager';
import ApplicationError from '../service/ApplicationError';
import * as MongoConverter from '../service/MongoConverter';
import * as Auth from '../middleware/Auth';

const userController: Router = express.Router();

userController.post('/login', async (request: Request, response: Response) => {
  try {
    const result = await UserManager.authenticate(
      request.body.email || request.body.login,
      request.body.password,
      request.body.deviceName,
    );
    response.status(200).send({ token: result });
  } catch (error) {
    ApplicationError.errorHandler(error, response);
  }
});

userController.post(
  '/register',
  async (request: Request, response: Response) => {
    try {
      const result = await UserManager.register(request.body);
      response.status(201).send(MongoConverter.fromUser(result));
    } catch (error) {
      ApplicationError.errorHandler(error, response);
    }
  },
);

userController.delete(
  '/logout',
  Auth.auth,
  async (request: Request, response: Response) => {
    try {
      await UserManager.logout(request.userId, request.deviceName);
      response.status(200).send({
        message: 'Logout successful',
      });
    } catch (error) {
      ApplicationError.errorHandler(error, response);
    }
  },
);

export default userController;
