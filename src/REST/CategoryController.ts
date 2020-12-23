import express, { Router, Request, Response } from 'express';
import * as CategoryManager from '../business/CategoryManager';
import * as MongoConverter from '../service/MongoConverter';
import * as Auth from '../middleware/Auth';
import ApplicationError from '../service/ApplicationError';
import { CategoryDocument } from '../DAO/documents/CategoryDocument';

const categoryController: Router = express.Router();

categoryController.post(
  '/',
  Auth.auth,
  async (request: Request, response: Response) => {
    try {
      const result = await CategoryManager.create(
        request.body.text,
        request.userId,
        request.body.color,
        request.body.icon,
      );
      response.status(201).send(MongoConverter.fromCategory(result));
    } catch (error) {
      ApplicationError.errorHandler(error, response);
    }
  },
);

categoryController.get(
  '/',
  Auth.auth,
  async (request: Request, response: Response) => {
    try {
      const result = await CategoryManager.getAll(request.userId);
      response.status(200).send(MongoConverter.fromCategoryArray(result));
    } catch (error) {
      ApplicationError.errorHandler(error, response);
    }
  },
);

categoryController.get(
  '/:id',
  Auth.auth,
  async (request: Request, response: Response) => {
    try {
      const result = await CategoryManager.getById(request.params.id);
      response.status(200).send(MongoConverter.fromCategory(result));
    } catch (error) {
      ApplicationError.errorHandler(error, response);
    }
  },
);

categoryController.delete(
  ':id',
  Auth.auth,
  async (request: Request, response: Response) => {
    try {
      await CategoryManager.deleteById(request.params.id);
      response.sendStatus(204);
    } catch (error) {
      ApplicationError.errorHandler(error, response);
    }
  },
);

export default categoryController;
