import { Types } from 'mongoose';
import { UserDocument } from '../DAO/documents/UserDocument';
import { NoteDocument } from '../DAO/documents/NoteDocument';

export const fromUser = (
  user: UserDocument,
): {
  id: string;
  login: string;
  email: string;
  displayName?: string;
  profileImageUrl?: string;
} => {
  return {
    id: user.id,
    login: user.login,
    email: user.email,
    displayName: user.displayName,
    profileImageUrl: user.profileImageUrl,
  };
};

export const toNote = (
  title: string,
  text: string,
  userId: string,
  color = '',
  createDate: Date = new Date(),
  lastEditDate: Date = new Date(),
): NoteDocument => {
  return {
    title: title,
    text: text,
    createDate: createDate,
    lastEditDate: lastEditDate,
    userId: Types.ObjectId(userId),
    color: color,
  } as NoteDocument;
};

export const fromNote = (
  note: NoteDocument,
): {
  id: string;
  title: string;
  text: string;
  createDate: Date;
  lastEditDate: Date;
  color: string;
} => {
  return {
    id: note.id,
    title: note.title,
    text: note.text,
    createDate: note.createDate,
    lastEditDate: note.lastEditDate,
    color: note.color,
  };
};

export const fromNoteArray = (
  noteArray: NoteDocument[],
): {
  id: string;
  title: string;
  text: string;
  createDate: Date;
  lastEditDate: Date;
  color: string;
}[] => {
  return noteArray.map((note) => fromNote(note));
};
