import express, { Router, Request, Response, NextFunction } from 'express';
import UserController from './UserController';

const routes: Router = express.Router();
routes.use(
  '/user',
  async (request: Request, response: Response, next: NextFunction) => {
    UserController(request, response, next);
  },
);

export default routes;
