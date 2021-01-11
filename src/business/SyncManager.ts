import { Types } from 'mongoose';
import { NoteDocument } from '../DAO/documents/NoteDocument';
import { TaskDocument } from '../DAO/documents/TaskDocument';
import { CategoryDocument } from '../DAO/documents/CategoryDocument';
import { Note } from '../DAO/models/NoteModel';
import { Task } from '../DAO/models/TaskModel';
import { Category } from '../DAO/models/CategoryModel';
import * as NoteManager from './NoteManager';
import * as TaskManager from './TaskManager';
import * as CategoryManager from './CategoryManager';
import * as MongoConverter from '../service/MongoConverter';

export const sync = async (
  rawNotes: any,
  rawTasks: any,
  rawCategories: any,
  userId: string,
): Promise<{
  notes: {
    id: string;
    title: string;
    text: string;
    createDate: Date;
    lastEditDate: Date;
    color: string;
  }[];
  tasks: {
    id: string;
    title: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    categoryId: string | undefined;
    favorite: boolean;
    done: boolean;
    note: string;
    lastEditDate: Date;
  }[];
  categories: {
    id: string;
    text: string;
    color?: string;
    icon?: string;
  }[];
}> => {
  const notes: NoteDocument[] = MongoConverter.toNoteArray(rawNotes, userId);
  const tasks: TaskDocument[] = MongoConverter.toTaskArray(rawTasks, userId);
  const categories: CategoryDocument[] = MongoConverter.toCategoryArray(
    rawCategories,
    userId,
  );
  let remoteNotes: NoteDocument[] = [];
  let remoteTasks: TaskDocument[] = [];
  let remoteCategories: CategoryDocument[] = [];

  const returnNotes: NoteDocument[] = [];
  const returnTasks: TaskDocument[] = [];
  const returnCategories: CategoryDocument[] = [];

  const dbNotes: NoteDocument[] = [];
  const dbTasks: TaskDocument[] = [];
  const dbCategories: CategoryDocument[] = [];
  try {
    remoteNotes = await NoteManager.getAll(userId);
  } catch (error) {
    remoteNotes = [];
  }
  try {
    remoteTasks = await TaskManager.getAll(userId);
  } catch (error) {
    remoteTasks = [];
  }
  try {
    remoteCategories = await CategoryManager.getAll(userId);
  } catch (error) {
    remoteCategories = [];
  }

  if (remoteNotes.length > 0) {
    for (let i = notes.length - 1; i >= 0; --i) {
      const remoteNoteIndex = remoteNotes.findIndex(
        (rNote) => rNote._id + '' === notes[i]._id + '',
      );
      if (remoteNoteIndex !== -1) {
        const remoteNote = remoteNotes.splice(remoteNoteIndex, 1)[0];
        if (remoteNote) {
          if (
            !notes[i].lastEditDate ||
            remoteNote.lastEditDate.getTime() > notes[i].lastEditDate.getTime()
          ) {
            returnNotes.push(remoteNote);
          } else {
            dbNotes.push(notes[i]);
          }
        }
      } else {
        dbNotes.push(notes[i]);
      }
      notes.splice(i, 1);
    }
    returnNotes.push(...remoteNotes);
  } else {
    dbNotes.push(...notes);
  }

  if (remoteTasks.length > 0) {
    for (let i = tasks.length - 1; i >= 0; --i) {
      if (tasks[i] !== undefined) {
        const remoteTaskIndex = remoteTasks.findIndex(
          (rTask) => rTask._id + '' === tasks[i]._id + '',
        );
        if (remoteTaskIndex !== -1) {
          const remoteTask = remoteTasks.splice(remoteTaskIndex, 1)[0];
          if (remoteTask) {
            if (
              !tasks[i].lastEditDate ||
              remoteTask.lastEditDate.getTime() >
                tasks[i].lastEditDate.getTime()
            ) {
              returnTasks.push(remoteTask);
            } else {
              dbTasks.push(tasks[i]);
            }
          }
        } else {
          dbTasks.push(tasks[i]);
        }
        tasks.splice(i, 1);
      }
    }
    returnTasks.push(...remoteTasks);
  } else {
    dbTasks.push(...tasks);
  }

  if (remoteCategories.length > 0) {
    for (let i = categories.length - 1; i >= 0; --i) {
      const remoteCategoryIndex = remoteCategories.findIndex(
        (rCategory) => rCategory._id + '' === categories[i]._id + '',
      );
      if (remoteCategoryIndex !== -1) {
        remoteCategories.splice(remoteCategoryIndex, 1);
        categories.splice(i, 1);
      } else {
        dbCategories.push(categories[i]);
      }
    }
  } else {
    dbCategories.push(...categories);
  }
  returnCategories.push(...remoteCategories);

  dbNotes.map((dbNote) => {
    dbNote.userId = Types.ObjectId(userId);
    return dbNote;
  });
  dbTasks.map((dbTask) => {
    dbTask.userId = Types.ObjectId(userId);
    return dbTask;
  });
  dbCategories.map((dbCategory) => {
    dbCategory.userId = Types.ObjectId(userId);
    return dbCategory;
  });

  try {
    Note.bulkWrite(
      dbNotes.map((note) => ({
        updateOne: {
          filter: { _id: note._id },
          update: { $set: note },
          upsert: true,
        },
      })),
    );
    Task.bulkWrite(
      dbTasks.map((task) => ({
        updateOne: {
          filter: { _id: task._id },
          update: { $set: task },
          upsert: true,
        },
      })),
    );
    Category.bulkWrite(
      dbCategories.map((category) => ({
        updateOne: {
          filter: { _id: category._id },
          update: { $set: category },
          upsert: true,
        },
      })),
    );
  } catch (error) {
    console.log('error updating database', error);
  }

  return {
    notes: MongoConverter.fromNoteArray(returnNotes),
    tasks: MongoConverter.fromTaskArray(returnTasks),
    categories: MongoConverter.fromCategoryArray(returnCategories),
  };
};
