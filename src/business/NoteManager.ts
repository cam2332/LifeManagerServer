import { NoteDocument } from '../DAO/documents/NoteDocument';
import { Note } from '../DAO/models/NoteModel';
import ApplicationError from '../service/ApplicationError';
import * as MongoConverter from '../service/MongoConverter';

export const create = async (
  title: string,
  text: string,
  color: string,
  userId: string,
): Promise<NoteDocument> => {
  const noteData = MongoConverter.toNote(title, text, userId, color);
  const createdNote = await Note.createNote(noteData);
  return createdNote;
};

export const getAll = async (userId: string): Promise<NoteDocument[]> => {
  let notes: NoteDocument[] = [];
  try {
    notes = await Note.getByUserId(userId);
    if (!notes || notes.length === 0) {
      throw new ApplicationError(
        'Notes not found',
        ApplicationError.NOT_FOUND.code,
      );
    }
  } catch (error) {
    if (error instanceof ApplicationError) {
      throw error;
    } else {
      throw new ApplicationError(
        'Notes not found',
        ApplicationError.NOT_FOUND.code,
      );
    }
  }
  return notes;
};

export const getAllByTitleAndText = async (
  userId: string,
  searchText: string,
): Promise<NoteDocument[]> => {
  let notes: NoteDocument[] = [];
  try {
    notes = await Note.getByUserIdTitleAndText(userId, searchText, searchText);
    if (!notes || notes.length === 0) {
      throw new ApplicationError(
        'Notes not found',
        ApplicationError.NOT_FOUND.code,
      );
    }
  } catch (error) {
    if (error instanceof ApplicationError) {
      throw error;
    } else {
      throw new ApplicationError(
        'Notes not found',
        ApplicationError.NOT_FOUND.code,
      );
    }
  }
  return notes;
};

export const deleteById = async (noteId: string): Promise<boolean> => {
  const deletedNote = await Note.findByIdAndDelete(noteId);
  if (!deletedNote) {
    throw new ApplicationError(
      'Note not found',
      ApplicationError.NOT_FOUND.code,
    );
  }
  return true;
};

export const deleteByIds = async (notesIds: string[]): Promise<boolean> => {
  const deletedNotes = Note.deleteMany({ _id: { $in: notesIds } });
  if ((await deletedNotes).deletedCount !== notesIds.length) {
    throw new ApplicationError(
      'Notes not found',
      ApplicationError.NOT_FOUND.code,
    );
  }
  return true;
};

export const updateTitle = async (
  noteId: string,
  title: string,
): Promise<boolean> => {
  const updatedNote = await Note.updateTitle(noteId, title);
  if (!updatedNote) {
    throw new ApplicationError(
      'Note not found',
      ApplicationError.NOT_FOUND.code,
    );
  }
  return true;
};

export const updateText = async (
  noteId: string,
  text: string,
): Promise<boolean> => {
  const updatedNote = await Note.updateText(noteId, text);
  if (!updatedNote) {
    throw new ApplicationError(
      'Note not found',
      ApplicationError.NOT_FOUND.code,
    );
  }
  return true;
};

export const updateColor = async (
  noteId: string,
  color: string,
): Promise<boolean> => {
  const updatedNote = await Note.updateColor(noteId, color);
  if (!updatedNote) {
    throw new ApplicationError(
      'Note not found',
      ApplicationError.NOT_FOUND.code,
    );
  }
  return true;
};
