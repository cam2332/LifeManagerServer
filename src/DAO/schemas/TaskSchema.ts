import { Schema, Types } from 'mongoose';
import { TaskDocument } from '../documents/TaskDocument';
import { Task } from '../models/TaskModel';

export const TaskSchema: Schema = new Schema(
  {
    _id: { type: Types.ObjectId },
    title: { type: String, required: true },
    categoryId: { type: Types.ObjectId, ref: 'categories' },
    favorite: Boolean,
    done: Boolean,
    note: String,
    startDate: Date,
    endDate: Date,
    lastEditDate: Date,
    userId: { type: Types.ObjectId, ref: 'users', required: true },
  },
  { versionKey: false, collection: 'tasks' },
);

TaskSchema.statics.createTask = async (
  newTask: TaskDocument,
): Promise<TaskDocument> => {
  const task = new Task(newTask);
  return await task.save();
};

TaskSchema.statics.getByUserId = async (
  userId: string,
): Promise<TaskDocument[]> => {
  const tasks = await Task.find({ userId: Types.ObjectId(userId) });
  return tasks;
};

TaskSchema.statics.getByUserIdAndTitle = async (
  userId: string,
  title: string,
): Promise<TaskDocument[]> => {
  const tasks = await Task.find({
    userId: Types.ObjectId(userId),
    title: { $regex: new RegExp('.*' + title + '.*', 'i') },
  });
  return tasks;
};

TaskSchema.statics.getByUserIdAndCategoryId = async (
  userId: string,
  categoryId: string,
): Promise<TaskDocument[]> => {
  let tasks: TaskDocument[];
  if (categoryId === 'planned') {
    tasks = await Task.find({
      userId: Types.ObjectId(userId),
      $or: [{ endDate: { $ne: undefined } }, { startDate: { $ne: undefined } }],
    });
  } else if (categoryId === 'favorite') {
    tasks = await Task.find({
      userId: Types.ObjectId(userId),
      favorite: true,
    });
  } else {
    tasks = await Task.find({
      userId: Types.ObjectId(userId),
      categoryId: Types.ObjectId(categoryId),
    });
  }
  return tasks;
};

TaskSchema.statics.getByUserIdAndTitleAndCategoryId = async (
  userId: string,
  title: string,
  categoryId: string,
): Promise<TaskDocument[]> => {
  let tasks: TaskDocument[];
  if (categoryId === 'planned') {
    tasks = await Task.find({
      userId: Types.ObjectId(userId),
      title: { $regex: new RegExp('.*' + title + '.*', 'i') },
      $or: [{ endDate: { $ne: undefined } }, { startDate: { $ne: undefined } }],
    });
  } else if (categoryId === 'favorite') {
    tasks = await Task.find({
      userId: Types.ObjectId(userId),
      title: { $regex: new RegExp('.*' + title + '.*', 'i') },
      favorite: true,
    });
  } else {
    tasks = await Task.find({
      userId: Types.ObjectId(userId),
      title: { $regex: new RegExp('.*' + title + '.*', 'i') },
      categoryId,
    });
  }
  return tasks;
};

TaskSchema.statics.updateTitle = async (
  id: string,
  title: string,
): Promise<TaskDocument | null> => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        title: title,
        lastEditDate: new Date(),
      },
      { new: true },
    );
    return updatedTask;
  } catch (error) {
    return null;
  }
};

TaskSchema.statics.updateStartDate = async (
  id: string,
  startDate: Date,
): Promise<TaskDocument | null> => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        startDate,
        lastEditDate: new Date(),
      },
      { new: true },
    );
    return updatedTask;
  } catch (error) {
    return null;
  }
};

TaskSchema.statics.updateEndDate = async (
  id: string,
  endDate: Date,
): Promise<TaskDocument | null> => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        endDate,
        lastEditDate: new Date(),
      },
      { new: true },
    );
    return updatedTask;
  } catch (error) {
    return null;
  }
};

TaskSchema.statics.updateCategoryId = async (
  id: string,
  categoryId: string,
): Promise<TaskDocument | null> => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        categoryId: Types.ObjectId(categoryId),
        lastEditDate: new Date(),
      },
      { new: true },
    );
    return updatedTask;
  } catch (error) {
    return null;
  }
};

TaskSchema.statics.updateNote = async (
  id: string,
  note: string,
): Promise<TaskDocument | null> => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        note,
        lastEditDate: new Date(),
      },
      { new: true },
    );
    return updatedTask;
  } catch (error) {
    return null;
  }
};

TaskSchema.statics.updateFavorite = async (
  id: string,
  favorite: boolean,
): Promise<TaskDocument | null> => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        favorite,
        lastEditDate: new Date(),
      },
      { new: true },
    );
    return updatedTask;
  } catch (error) {
    return null;
  }
};

TaskSchema.statics.updateDone = async (
  id: string,
  done: boolean,
): Promise<TaskDocument | null> => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        done,
        lastEditDate: new Date(),
      },
      { new: true },
    );
    return updatedTask;
  } catch (error) {
    return null;
  }
};
