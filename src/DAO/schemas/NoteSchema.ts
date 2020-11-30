import { Schema, Types } from 'mongoose';
import { NoteDocument } from '../documents/NoteDocument';
import { Note } from '../models/NoteModel';

export const NoteSchema: Schema = new Schema(
  {
    title: String,
    text: String,
    createDate: Date,
    lastEditDate: Date,
    color: String,
    userId: { type: Types.ObjectId, ref: 'users', required: true },
  },
  { versionKey: false, collection: 'notes' },
);

NoteSchema.statics.createNote = async (
  newNote: NoteDocument,
): Promise<NoteDocument> => {
  const note = new Note(newNote);
  return await note.save();
};

NoteSchema.statics.getByUserId = async (
  userId: string,
): Promise<NoteDocument[]> => {
  const notes = await Note.find({ userId: Types.ObjectId(userId) });
  return notes;
};

NoteSchema.statics.getByUserIdTitleAndText = async (
  userId: string,
  title: string,
  text: string,
): Promise<NoteDocument[]> => {
  const notes = await Note.find({
    userId: userId,
    $or: [
      { title: { $regex: new RegExp('.*' + title + '.*', 'i') } },
      { text: { $regex: new RegExp('.*' + text + '.*', 'i') } },
    ],
  });
  return notes;
};

NoteSchema.statics.updateTitle = async (
  id: string,
  title: string,
): Promise<NoteDocument | null> => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(id, {
      title: title,
      lastEditDate: new Date(),
    });
    return updatedNote;
  } catch (error) {
    console.error('error updating title');
    return null;
  }
};

NoteSchema.statics.updateText = async (
  id: string,
  text: string,
): Promise<NoteDocument | null> => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(id, {
      text: text,
      lastEditDate: new Date(),
    });
    return updatedNote;
  } catch (error) {
    console.error('error updating text');
    return null;
  }
};

NoteSchema.statics.updateColor = async (
  id: string,
  color: string,
): Promise<NoteDocument | null> => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(id, {
      color: color,
      lastEditDate: new Date(),
    });
    return updatedNote;
  } catch (error) {
    console.error('error updating color');
    return null;
  }
};
