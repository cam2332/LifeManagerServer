import { NoteDocument } from '../DAO/documents/NoteDocument';
import { Note } from '../DAO/models/NoteModel';
import ApplicationError from '../service/ApplicationError';
import * as MongoConverter from '../service/MongoConverter';

export const create = async (
  title: string,
  text: string,
  userId: string,
): Promise<NoteDocument> => {
  const noteData = MongoConverter.toNote(title, text, userId);
  const createdNote = await Note.createNote(noteData);
  return createdNote;
};

export const getAll = async (userId: string): Promise<NoteDocument[]> => {
  const notes = await Note.getByUserId(userId);
  if (!notes) {
    throw new ApplicationError(
      'Notes not found',
      ApplicationError.NOT_FOUND.code,
    );
  }
  return notes as NoteDocument[];
};

export const getAllByTitleAndText = async (
  userId: string,
  searchText: string,
): Promise<NoteDocument[]> => {
  const notes = await Note.getByUserIdTitleAndText(
    userId,
    searchText,
    searchText,
  );
  if (!notes) {
    throw new ApplicationError(
      'Notes not found',
      ApplicationError.NOT_FOUND.code,
    );
  }
  return notes as NoteDocument[];
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
