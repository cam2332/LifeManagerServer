import { Model, model } from 'mongoose';
import { NoteSchema } from '../schemas/NoteSchema';
import { NoteDocument } from '../documents/NoteDocument';

export interface NoteModel extends Model<NoteDocument> {
  createNote(newNote: NoteDocument): Promise<NoteDocument>;
  getByUserId(userId: string): Promise<NoteDocument[]>;
  getByUserIdTitleAndText(
    userId: string,
    title: string,
    text: string,
  ): Promise<NoteDocument[]>;
  updateTitle(id: string, title: string): Promise<NoteDocument | null>;
  updateText(id: string, text: string): Promise<NoteDocument | null>;
}

export const Note: NoteModel = model<NoteDocument, NoteModel>(
  'notes',
  NoteSchema,
);
