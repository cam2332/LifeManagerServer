import express, { Router, Request, Response } from 'express';
import { auth } from '../middleware/Auth';
import ApplicationError from '../service/ApplicationError';
import * as SyncManager from '../business/SyncManager';

const syncController: Router = express.Router();

syncController.post('/', auth, async (request: Request, response: Response) => {
  try {
    const result = await SyncManager.sync(
      request.body.notes,
      request.body.tasks,
      request.body.categories,
      request.userId,
    );
    if (
      result.notes.length === 0 &&
      result.tasks.length === 0 &&
      result.categories.length === 0
    ) {
      response.status(204).send();
    } else {
      response.status(200).send(result);
    }
  } catch (error) {
    ApplicationError.errorHandler(error, response);
  }
});

export default syncController;
