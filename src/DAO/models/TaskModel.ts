import { Model, model } from 'mongoose';
import { TaskSchema } from '../schemas/TaskSchema';
import { TaskDocument } from '../documents/TaskDocument';

export interface TaskModel extends Model<TaskDocument> {
  createTask(newNote: TaskDocument): Promise<TaskDocument>;
  getByUserId(userId: string): Promise<TaskDocument[]>;
  getByUserIdAndTitle(userId: string, title: string): Promise<TaskDocument[]>;
  getByUserIdAndCategoryId(
    userId: string,
    categoryId: string,
  ): Promise<TaskDocument[]>;
  getByUserIdAndTitleAndCategoryId(
    userId: string,
    title: string,
    categoryId: string,
  ): Promise<TaskDocument[]>;
  updateTitle(id: string, title: string): Promise<TaskDocument | null>;
  updateStartDate(id: string, startDate: Date): Promise<TaskDocument | null>;
  updateEndDate(id: string, endDate: Date): Promise<TaskDocument | null>;
  updateCategoryId(
    id: string,
    categoryId: string,
  ): Promise<TaskDocument | null>;
  updateNote(id: string, note: string): Promise<TaskDocument | null>;
  updateFavorite(id: string, favorite: boolean): Promise<TaskDocument | null>;
  updateDone(id: string, done: boolean): Promise<TaskDocument | null>;
}

export const Task: TaskModel = model<TaskDocument, TaskModel>(
  'tasks',
  TaskSchema,
);
