import express, { Router, Request, Response } from 'express';
import * as UserManager from '../business/UserManager';
import ApplicationError from '../service/ApplicationError';
import * as MongoConverter from '../service/MongoConverter';

const userController: Router = express.Router();

userController.post('/login', async (request: Request, response: Response) => {
  try {
    const result = await UserManager.authenticate(
      request.body.email,
      request.body.password,
      request.body.deviceName || 'test',
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
      response.status(200).send(MongoConverter.fromUser(result));
    } catch (error) {
      ApplicationError.errorHandler(error, response);
    }
  },
);

userController.delete(
  '/logout',
  async (request: Request, response: Response) => {
    try {
      const result = await UserManager.logout(request.body.userId);
      result
        ? response.status(200).send({
            message: 'Logout successful',
          })
        : response.status(ApplicationError.NOT_FOUND.code).send({
            message: 'Logout failed',
          });
    } catch (error) {}
  },
);

export default userController;
