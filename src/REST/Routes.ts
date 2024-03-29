import express, { Router, Request, Response, NextFunction } from 'express';
import UserController from './UserController';
import NoteController from './NoteController';
import TaskController from './TaskController';
import CategoryController from './CategoryController';
import SyncController from './SyncController';

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

routes.use(
  '/task',
  async (request: Request, response: Response, next: NextFunction) => {
    TaskController(request, response, next);
  },
);

routes.use(
  '/category',
  async (request: Request, response: Response, next: NextFunction) => {
    CategoryController(request, response, next);
  },
);

routes.use(
  '/sync',
  async (request: Request, response: Response, next: NextFunction) => {
    SyncController(request, response, next);
  },
);

export default routes;
