import express, { Router, Request, Response, NextFunction } from 'express';
import UserController from './UserController';
import NoteController from './NoteController';

const routes: Router = express.Router();
routes.use(
  '/user',
  async (request: Request, response: Response, next: NextFunction) => {
    UserController(request, response, next);
  },
);
routes.use(
  '/note',
  async (request: Request, response: Response, next: NextFunction) => {
    NoteController(request, response, next);
  },
);

export default routes;
