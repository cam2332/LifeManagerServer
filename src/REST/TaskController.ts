import express, { Router, Request, Response } from 'express';
import * as TaskManager from '../business/TaskManager';
import * as MongoConverter from '../service/MongoConverter';
import * as Auth from '../middleware/Auth';
import ApplicationError from '../service/ApplicationError';
import { TaskDocument } from '../DAO/documents/TaskDocument';

const taskController: Router = express.Router();

taskController.post(
  '/',
  Auth.auth,
  async (request: Request, response: Response) => {
    try {
      const result = await TaskManager.create(
        request.body.title,
        request.body.startDate,
        request.body.endDate,
        request.body.categoryId,
        request.body.note,
        request.userId,
      );
      response.status(201).send(MongoConverter.fromTask(result));
    } catch (error) {
      ApplicationError.errorHandler(error, response);
    }
  },
);

taskController.get(
  '/',
  Auth.auth,
  async (request: Request, response: Response) => {
    try {
      const result = await TaskManager.getAll(request.userId);
      response.status(200).send(MongoConverter.fromTaskArray(result));
    } catch (error) {
      ApplicationError.errorHandler(error, response);
    }
  },
);

taskController.get(
  '/search',
  Auth.auth,
  async (request: Request, response: Response) => {
    try {
      const searchText = request.query.searchText;
      const categoryId = request.query.categoryId;

      let result: TaskDocument[] = [];
      if (searchText && categoryId) {
        result = await TaskManager.getAllByTitleAndCategoryId(
          request.userId,
          searchText.toString(),
          categoryId.toString(),
        );
      } else if (searchText) {
        result = await TaskManager.getAllByTitle(
          request.userId,
          searchText.toString(),
        );
      } else if (categoryId) {
        result = await TaskManager.getAllByCategoryId(
          request.userId,
          categoryId.toString(),
        );
      } else if (!searchText && !categoryId) {
        throw new ApplicationError(
          'Tasks not found',
          ApplicationError.NOT_FOUND.code,
        );
      }
      response.status(200).send(MongoConverter.fromTaskArray(result));
    } catch (error) {
      ApplicationError.errorHandler(error, response);
    }
  },
);

taskController.delete(
  '/:id',
  Auth.auth,
  async (request: Request, response: Response) => {
    try {
      await TaskManager.deleteById(request.params.id);
      response.sendStatus(204);
    } catch (error) {
      ApplicationError.errorHandler(error, response);
    }
  },
);

taskController.delete(
  '/',
  Auth.auth,
  async (request: Request, response: Response) => {
    try {
      let ids: string[] = [];
      if (request.query.ids && request.query.ids !== '') {
        const idString = request.query.ids as string;
        ids = idString.split(',');
      }
      if (ids.length > 0) {
        await TaskManager.deleteByIds(ids);
        response.sendStatus(204);
      } else {
        throw new ApplicationError(
          'Invalid request query parameter',
          ApplicationError.BAD_REQUEST.code,
        );
      }
    } catch (error) {
      ApplicationError.errorHandler(error, response);
    }
  },
);

taskController.patch(
  '/:id/title/:title',
  Auth.auth,
  async (request: Request, response: Response) => {
    try {
      await TaskManager.updateTitle(request.params.id, request.params.title);
      response.sendStatus(204);
    } catch (error) {
      ApplicationError.errorHandler(error, response);
    }
  },
);

taskController.patch(
  '/:id/start-date/:startDate',
  Auth.auth,
  async (request: Request, response: Response) => {
    try {
      await TaskManager.updateStartDate(
        request.params.id,
        request.params.startDate,
      );
      response.sendStatus(204);
    } catch (error) {
      ApplicationError.errorHandler(error, response);
    }
  },
);

taskController.patch(
  '/:id/end-date/:endDate',
  Auth.auth,
  async (request: Request, response: Response) => {
    try {
      await TaskManager.updateEndDate(
        request.params.id,
        request.params.endDate,
      );
      response.sendStatus(204);
    } catch (error) {
      ApplicationError.errorHandler(error, response);
    }
  },
);

taskController.patch(
  '/:id/category-id/:categoryId',
  Auth.auth,
  async (request: Request, response: Response) => {
    try {
      await TaskManager.updateCategoryId(
        request.params.id,
        request.params.categoryId,
      );
      response.sendStatus(204);
    } catch (error) {
      ApplicationError.errorHandler(error, response);
    }
  },
);

taskController.patch(
  '/:id/note/:note',
  Auth.auth,
  async (request: Request, response: Response) => {
    try {
      await TaskManager.updateNote(request.params.id, request.params.note);
      response.sendStatus(204);
    } catch (error) {
      ApplicationError.errorHandler(error, response);
    }
  },
);

taskController.patch(
  '/:id/favorite/:favorite',
  Auth.auth,
  async (request: Request, response: Response) => {
    try {
      await TaskManager.updateFavorite(
        request.params.id,
        request.params.favorite == 'true',
      );
      response.sendStatus(204);
    } catch (error) {
      ApplicationError.errorHandler(error, response);
    }
  },
);

taskController.patch(
  '/:id/done/:done',
  Auth.auth,
  async (request: Request, response: Response) => {
    try {
      await TaskManager.updateDone(
        request.params.id,
        request.params.done == 'true',
      );
      response.sendStatus(204);
    } catch (error) {
      ApplicationError.errorHandler(error, response);
    }
  },
);

export default taskController;
