import express, { Router, Request, Response } from 'express';
import ApplicationError from '../service/ApplicationError';
import * as NoteManager from '../business/NoteManager';
import * as MongoConverter from '../service/MongoConverter';
import * as Auth from '../middleware/Auth';

const noteController: Router = express.Router();

/**
 * Create note
 */
noteController.post(
  '/',
  Auth.auth,
  async (request: Request, response: Response) => {
    try {
      const result = await NoteManager.create(
        request.body.title,
        request.body.text,
        request.body.color,
        request.userId,
      );
      response.status(201).send(MongoConverter.fromNote(result));
    } catch (error) {
      ApplicationError.errorHandler(error, response);
    }
  },
);

/**
 * Get all notes
 */
noteController.get(
  '/',
  Auth.auth,
  async (request: Request, response: Response) => {
    try {
      const result = await NoteManager.getAll(request.userId);
      response.status(200).send(MongoConverter.fromNoteArray(result));
    } catch (error) {
      ApplicationError.errorHandler(error, response);
    }
  },
);

/**
 * Get notes by text
 */
noteController.get(
  '/search/:searchText',
  Auth.auth,
  async (request: Request, response: Response) => {
    try {
      const result = await NoteManager.getAllByTitleAndText(
        request.userId,
        request.params.searchText,
      );
      response.status(200).send(MongoConverter.fromNoteArray(result));
    } catch (error) {
      ApplicationError.errorHandler(error, response);
    }
  },
);

/**
 * Delete note
 */
noteController.delete(
  '/:id',
  Auth.auth,
  async (request: Request, response: Response) => {
    try {
      await NoteManager.deleteById(request.params.id);
      response.sendStatus(204);
    } catch (error) {
      ApplicationError.errorHandler(error, response);
    }
  },
);

noteController.delete(
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
        await NoteManager.deleteByIds(ids);
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

/**
 * Update note title
 */
noteController.patch(
  '/:id/title/:title',
  Auth.auth,
  async (request: Request, response: Response) => {
    try {
      await NoteManager.updateTitle(request.params.id, request.params.title);
      response.sendStatus(204);
    } catch (error) {
      ApplicationError.errorHandler(error, response);
    }
  },
);

/**
 * Update note text
 */
noteController.patch(
  '/:id/text/:text',
  Auth.auth,
  async (request: Request, response: Response) => {
    try {
      await NoteManager.updateText(request.params.id, request.params.text);
      response.sendStatus(204);
    } catch (error) {
      ApplicationError.errorHandler(error, response);
    }
  },
);

/**
 * Update note color
 */
noteController.patch(
  '/:id/color/:color',
  Auth.auth,
  async (request: Request, response: Response) => {
    try {
      await NoteManager.updateColor(request.params.id, request.params.color);
      response.sendStatus(204);
    } catch (error) {
      ApplicationError.errorHandler(error, response);
    }
  },
);

export default noteController;
