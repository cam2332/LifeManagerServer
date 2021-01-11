import express, { Router, Request, Response } from 'express';
import { auth } from '../middleware/Auth';
import ApplicationError from '../service/ApplicationError';
import { NoteDocument } from '../DAO/documents/NoteDocument';
import { TaskDocument } from '../DAO/documents/TaskDocument';
import { CategoryDocument } from '../DAO/documents/CategoryDocument';
import * as SyncManager from '../business/SyncManager';
import * as MongoConverter from '../service/MongoConverter';

const syncController: Router = express.Router();

syncController.post('/', auth, async (request: Request, response: Response) => {
  try {
    const notes: NoteDocument[] = MongoConverter.toNoteArray(
      request.body.notes,
      request.userId,
    );
    const tasks: TaskDocument[] = MongoConverter.toTaskArray(
      request.body.tasks,
      request.userId,
    );
    const categories: CategoryDocument[] = MongoConverter.toCategoryArray(
      request.body.categories,
      request.userId,
    );
    const result = await SyncManager.sync(
      notes,
      tasks,
      categories,
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