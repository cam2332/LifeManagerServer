import { Types } from 'mongoose';
import { UserDocument } from '../DAO/documents/UserDocument';
import { NoteDocument } from '../DAO/documents/NoteDocument';
import { TaskDocument } from '../DAO/documents/TaskDocument';
import { CategoryDocument } from '../DAO/documents/CategoryDocument';

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

export const toTask = (
  title: string,
  startDate: Date | undefined,
  endDate: Date | undefined,
  categoryId: string,
  userId: string,
  note = '',
  favorite = false,
  done = false,
  lastEditDate = new Date(),
): TaskDocument => {
  return {
    title,
    startDate,
    endDate,
    categoryId: Types.ObjectId(categoryId),
    favorite,
    done,
    note,
    lastEditDate,
    userId: Types.ObjectId(userId),
  } as TaskDocument;
};

export const fromTask = (
  task: TaskDocument,
): {
  id: string;
  title: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  categoryId: string | undefined;
  favorite: boolean;
  done: boolean;
  note: string;
  lastEditDate: Date | undefined;
} => {
  return {
    id: task.id,
    title: task.title,
    startDate: task.startDate,
    endDate: task.endDate,
    categoryId: task.categoryId?.toHexString(),
    favorite: task.favorite,
    done: task.done,
    note: task.note,
    lastEditDate: task.lastEditDate,
  };
};

export const fromTaskArray = (
  taskArray: TaskDocument[],
): {
  id: string;
  title: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  categoryId: string | undefined;
  favorite: boolean;
  done: boolean;
  note: string;
  lastEditDate: Date | undefined;
}[] => {
  return taskArray.map((task) => fromTask(task));
};

export const toCategory = (
  text: string,
  userId: string,
  color = '',
  icon = '',
): CategoryDocument => {
  return {
    text,
    userId: Types.ObjectId(userId),
    color,
    icon,
  } as CategoryDocument;
};

export const fromCategory = (
  category: CategoryDocument,
): {
  id: string;
  text: string;
  color?: string;
  icon?: string;
} => {
  return {
    id: category.id,
    text: category.text,
    color: category.color,
    icon: category.icon,
  };
};

export const fromCategoryArray = (
  categories: CategoryDocument[],
): {
  id: string;
  text: string;
  color?: string;
  icon?: string;
}[] => {
  return categories.map((category) => fromCategory(category));
};
