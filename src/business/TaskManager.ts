import { TaskDocument } from '../DAO/documents/TaskDocument';
import { Task } from '../DAO/models/TaskModel';
import ApplicationError from '../service/ApplicationError';
import * as MongoConverter from '../service/MongoConverter';

export const create = async (
  title: string,
  startDate: Date,
  endDate: Date,
  categoryId: string,
  note: string,
  userId: string,
  favorite = false,
  done = false,
  lastEditDate = new Date(),
): Promise<TaskDocument> => {
  const taskData = MongoConverter.toTask(
    title,
    startDate,
    endDate,
    categoryId,
    userId,
    note,
    favorite,
    done,
    lastEditDate,
  );
  const createdTask = await Task.createTask(taskData);
  return createdTask;
};

export const getAll = async (userId: string): Promise<TaskDocument[]> => {
  let tasks: TaskDocument[] = [];
  try {
    tasks = await Task.getByUserId(userId);
    if (!tasks || tasks.length === 0) {
      throw new ApplicationError(
        'Tasks not found',
        ApplicationError.NOT_FOUND.code,
      );
    }
  } catch (error) {
    if (error instanceof ApplicationError) {
      throw error;
    } else {
      throw new ApplicationError(
        'Tasks not found',
        ApplicationError.NOT_FOUND.code,
      );
    }
  }
  return tasks;
};

export const getAllByTitle = async (
  userId: string,
  title: string,
): Promise<TaskDocument[]> => {
  let tasks: TaskDocument[] = [];
  try {
    tasks = await Task.getByUserIdAndTitle(userId, title);
    if (!tasks || tasks.length === 0) {
      throw new ApplicationError(
        'Tasks not found',
        ApplicationError.NOT_FOUND.code,
      );
    }
  } catch (error) {
    if (error instanceof ApplicationError) {
      throw error;
    } else {
      throw new ApplicationError(
        'Tasks not found',
        ApplicationError.NOT_FOUND.code,
      );
    }
  }

  return tasks;
};

export const getAllByCategoryId = async (
  userId: string,
  categoryId: string,
): Promise<TaskDocument[]> => {
  let tasks: TaskDocument[] = [];
  try {
    tasks = await Task.getByUserIdAndCategoryId(userId, categoryId);
    if (!tasks || tasks.length === 0) {
      throw new ApplicationError(
        'Tasks not found',
        ApplicationError.NOT_FOUND.code,
      );
    }
  } catch (error) {
    if (error instanceof ApplicationError) {
      throw error;
    } else {
      throw new ApplicationError(
        'Tasks not found',
        ApplicationError.NOT_FOUND.code,
      );
    }
  }

  return tasks;
};

export const getAllByTitleAndCategoryId = async (
  userId: string,
  title: string,
  categoryId: string,
): Promise<TaskDocument[]> => {
  let tasks: TaskDocument[] = [];
  try {
    tasks = await Task.getByUserIdAndTitleAndCategoryId(
      userId,
      title,
      categoryId,
    );
    if (!tasks || tasks.length === 0) {
      throw new ApplicationError(
        'Tasks not found',
        ApplicationError.NOT_FOUND.code,
      );
    }
  } catch (error) {
    if (error instanceof ApplicationError) {
      throw error;
    } else {
      throw new ApplicationError(
        'Tasks not found',
        ApplicationError.NOT_FOUND.code,
      );
    }
  }
  return tasks;
};

export const updateTitle = async (
  taskId: string,
  title: string,
): Promise<TaskDocument> => {
  const updatedTask = await Task.updateTitle(taskId, title);
  if (!updatedTask) {
    throw new ApplicationError(
      'Task not found',
      ApplicationError.NOT_FOUND.code,
    );
  }
  return updatedTask;
};

export const updateStartDate = async (
  taskId: string,
  startDate: string,
): Promise<TaskDocument> => {
  const date = Date.parse(startDate);
  if (date === NaN) {
    throw new ApplicationError(
      'Invalid date format',
      ApplicationError.BAD_REQUEST.code,
    );
  }
  const updatedTask = await Task.updateStartDate(taskId, new Date(date));
  if (!updatedTask) {
    throw new ApplicationError(
      'Task not found',
      ApplicationError.NOT_FOUND.code,
    );
  }
  return updatedTask;
};

export const updateEndDate = async (
  taskId: string,
  endDate: string,
): Promise<TaskDocument> => {
  const date = Date.parse(endDate);
  if (date === NaN) {
    throw new ApplicationError(
      'Invalid date format',
      ApplicationError.BAD_REQUEST.code,
    );
  }
  const updatedTask = await Task.updateEndDate(taskId, new Date(date));
  if (!updatedTask) {
    throw new ApplicationError(
      'Task not found',
      ApplicationError.NOT_FOUND.code,
    );
  }
  return updatedTask;
};

export const updateCategoryId = async (
  taskId: string,
  categoryId: string,
): Promise<TaskDocument> => {
  const updatedTask = await Task.updateCategoryId(taskId, categoryId);
  if (!updatedTask) {
    throw new ApplicationError(
      'Task not found',
      ApplicationError.NOT_FOUND.code,
    );
  }
  return updatedTask;
};

export const updateNote = async (
  taskId: string,
  note: string,
): Promise<TaskDocument> => {
  const updatedTask = await Task.updateNote(taskId, note);
  if (!updatedTask) {
    throw new ApplicationError(
      'Task not found',
      ApplicationError.NOT_FOUND.code,
    );
  }
  return updatedTask;
};

export const updateFavorite = async (
  taskId: string,
  favorite: boolean,
): Promise<TaskDocument> => {
  const updatedTask = await Task.updateFavorite(taskId, favorite);
  if (!updatedTask) {
    throw new ApplicationError(
      'Task not found',
      ApplicationError.NOT_FOUND.code,
    );
  }
  return updatedTask;
};

export const updateDone = async (
  taskId: string,
  done: boolean,
): Promise<TaskDocument> => {
  const updatedTask = await Task.updateDone(taskId, done);
  if (!updatedTask) {
    throw new ApplicationError(
      'Task not found',
      ApplicationError.NOT_FOUND.code,
    );
  }
  return updatedTask;
};

export const deleteById = async (taskId: string): Promise<boolean> => {
  const deletedTask = await Task.findByIdAndDelete(taskId);
  if (!deletedTask) {
    throw new ApplicationError(
      'Task not found',
      ApplicationError.NOT_FOUND.code,
    );
  }
  return true;
};

export const deleteByIds = async (tasksIds: string[]): Promise<boolean> => {
  const deletedTasks = await Task.deleteMany({ _id: { $in: tasksIds } });
  if (deletedTasks.deletedCount !== tasksIds.length) {
    throw new ApplicationError(
      'Tasks not found',
      ApplicationError.NOT_FOUND.code,
    );
  }
  return true;
};
