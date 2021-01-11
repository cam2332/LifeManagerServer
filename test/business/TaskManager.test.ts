import { expect } from 'chai';
import { describe } from 'mocha';
import { Types } from 'mongoose';
import * as InMemoryMongo from '../InMemoryMongo';
import * as TaskManager from '../../src/business/TaskManager';
import ApplicationError from '../../src/service/ApplicationError';

describe('TaskManager', () => {
  before(async () => await InMemoryMongo.connect());

  beforeEach(async () => await createTaskBeforeTest());

  afterEach(async () => await InMemoryMongo.clearDatabase());

  after(async () => await InMemoryMongo.closeDatabase());

  it('should create a task', async () => {
    const createdTask = await TaskManager.create(
      taskTitle,
      taskStartDate,
      taskEndDate,
      categoryId,
      taskNote,
      userId,
    );

    expect(createdTask.title).to.be.equal(taskTitle);
    expect(createdTask.startDate).to.be.equal(taskStartDate);
    expect(createdTask.endDate).to.be.equal(taskEndDate);
    expect(createdTask.categoryId).to.be.eql(Types.ObjectId(categoryId));
    expect(createdTask.note).to.be.equal(taskNote);
    expect(createdTask.userId).to.be.eql(Types.ObjectId(userId));
  });
  it('should create a task with only title and userId', async () => {
    const createdTask = await TaskManager.create(
      taskTitle,
      undefined,
      undefined,
      undefined,
      undefined,
      userId,
    );

    expect(createdTask.title).to.be.equal(taskTitle);
    expect(createdTask.startDate).to.be.equal(undefined);
    expect(createdTask.endDate).to.be.equal(undefined);
    expect(createdTask.categoryId).to.be.eql(undefined);
    expect(createdTask.note).to.be.equal('');
    expect(createdTask.userId).to.be.eql(Types.ObjectId(userId));
  });

  it('should get tasks by user id', async () => {
    const foundTasks = await TaskManager.getAll(userId);
    expect(foundTasks.length).to.be.equal(1);
    expect(foundTasks[0].id).to.be.equal(taskId);
    expect(foundTasks[0].title).to.be.equal(taskTitle);
  });

  it('should throw error if no user id is provided', async () => {
    try {
      await TaskManager.getAll('');
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Tasks not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it('should get tasks by user id and title', async () => {
    const foundTasks = await TaskManager.getAllByTitle(userId, taskTitle);
    expect(foundTasks.length).to.be.equal(1);
    expect(foundTasks[0].id).to.be.equal(taskId);
    expect(foundTasks[0].title).to.be.equal(taskTitle);
  });

  it('should throw error if no user id and title', async () => {
    try {
      await TaskManager.getAllByTitle('', '');
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Tasks not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it('should get tasks by user id and category id', async () => {
    const foundTasks = await TaskManager.getAllByCategoryId(userId, categoryId);
    expect(foundTasks.length).to.be.equal(1);
    expect(foundTasks[0].id).to.be.equal(taskId);
    expect(foundTasks[0].categoryId).to.be.eql(Types.ObjectId(categoryId));
  });

  it('should throw error if no user id and category id', async () => {
    try {
      await TaskManager.getAllByCategoryId('', '');
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Tasks not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it(`should get tasks by user id and category 'planned'`, async () => {
    const foundTasks = await TaskManager.getAllByCategoryId(userId, 'planned');
    expect(foundTasks.length).to.be.equal(1);
    expect(foundTasks[0].id).to.be.equal(taskId);
    expect([foundTasks[0].startDate, foundTasks[0].endDate]).to.satisfy(
      (dates: Date[]) => {
        return dates[0] !== undefined || dates[1] !== undefined;
      },
    );
  });

  it(`should get tasks by user id and category 'favorite'`, async () => {
    const foundTasks = await TaskManager.getAllByCategoryId(userId, 'favorite');
    expect(foundTasks.length).to.be.equal(1);
    expect(foundTasks[0].id).to.be.equal(taskId);
    expect(foundTasks[0].favorite).to.be.true;
  });

  it('should throw error if no user id and category id is provided', async () => {
    try {
      await TaskManager.getAllByCategoryId('', '');
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Tasks not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it('should get tasks by user id, title and category id', async () => {
    const foundTasks = await TaskManager.getAllByTitleAndCategoryId(
      userId,
      't',
      categoryId,
    );
    expect(foundTasks.length).to.be.equal(1);
    expect(foundTasks[0].id).to.be.equal(taskId);
    expect(foundTasks[0].userId).to.be.eql(Types.ObjectId(userId));
    expect(foundTasks[0].categoryId).to.be.eql(Types.ObjectId(categoryId));
  });

  it('should throw error if no user id, title and category id', async () => {
    try {
      await TaskManager.getAllByTitleAndCategoryId('', '', '');
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Tasks not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it('should update task title', async () => {
    const updatedTask = await TaskManager.updateTitle(taskId, 'new title');
    expect(updatedTask.title).to.be.equal('new title');
  });

  it('should not update task title if no user id', async () => {
    try {
      await TaskManager.updateTitle('', '');
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Task not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it('should update task start date', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const updatedTask = await TaskManager.updateStartDate(
      taskId,
      tomorrow.toDateString(),
    );
    expect(updatedTask.startDate?.toDateString()).to.be.equal(
      tomorrow.toDateString(),
    );
  });

  it('should not update task start date if no user id', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    try {
      await TaskManager.updateStartDate('', tomorrow.toDateString());
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Task not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it('should not update task start date if invalid date', async () => {
    try {
      await TaskManager.updateStartDate(taskId, '');
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Invalid date format');
      expect(error.code).to.be.equal(ApplicationError.BAD_REQUEST.code);
    }
  });

  it('should update task end date', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const updatedTask = await TaskManager.updateEndDate(
      taskId,
      tomorrow.toDateString(),
    );
    expect(updatedTask.endDate?.toDateString()).to.be.equal(
      tomorrow.toDateString(),
    );
  });

  it('should not update task end date if no user id', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    try {
      await TaskManager.updateEndDate('', tomorrow.toDateString());
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Task not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it('should not update task end date if invalid date', async () => {
    try {
      await TaskManager.updateEndDate(taskId, '');
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Invalid date format');
      expect(error.code).to.be.equal(ApplicationError.BAD_REQUEST.code);
    }
  });

  it('should update task category id', async () => {
    const newCategoryId = Types.ObjectId();
    const updatedTask = await TaskManager.updateCategoryId(
      taskId,
      newCategoryId.toHexString(),
    );
    expect(updatedTask.categoryId).to.be.eql(
      Types.ObjectId(newCategoryId.toHexString()),
    );
  });

  it('should not update task category id', async () => {
    try {
      const newCategoryId = Types.ObjectId();
      await TaskManager.updateCategoryId('', newCategoryId.toHexString());
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Task not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it('should update task note', async () => {
    const newNote = 'new note';
    const updatedTask = await TaskManager.updateNote(taskId, newNote);
    expect(updatedTask.note).to.be.equal(newNote);
  });

  it('should not update task note', async () => {
    try {
      const newNote = 'new note';
      await TaskManager.updateNote('', newNote);
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Task not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it('should update task favorite', async () => {
    const newFavorite = true;
    const updatedTask = await TaskManager.updateFavorite(taskId, newFavorite);
    expect(updatedTask.favorite).to.be.equal(newFavorite);
  });

  it('should not update task favorite', async () => {
    try {
      await TaskManager.updateFavorite('', true);
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Task not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it('should update task done', async () => {
    const newDone = true;
    const updatedTask = await TaskManager.updateDone(taskId, newDone);
    expect(updatedTask.done).to.be.equal(newDone);
  });

  it('should not update task done', async () => {
    try {
      await TaskManager.updateDone('', true);
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Task not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it('should delete task by id', async () => {
    expect(await TaskManager.deleteById(taskId)).to.be.equal(true);
    try {
      await TaskManager.getAll(userId);
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Tasks not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it('should throw error if invalid task id', async () => {
    try {
      await TaskManager.deleteById(Types.ObjectId().toHexString());
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Tasks not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it('should throw error if no task id', async () => {
    try {
      await TaskManager.deleteById('');
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Task not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it('should delete tasks by ids', async () => {
    const newTaskId = await createTask();
    expect(await TaskManager.deleteByIds([taskId, newTaskId])).to.be.equal(
      true,
    );
    try {
      await TaskManager.getAll(userId);
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Tasks not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it('should throw error if invalid tasks ids', async () => {
    try {
      await TaskManager.deleteByIds([Types.ObjectId().toHexString()]);
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Tasks not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });
});

const createTaskBeforeTest = async (): Promise<void> => {
  taskId = await createTask();
};

const createTask = async (): Promise<string> => {
  const createdTask = await TaskManager.create(
    taskTitle,
    taskStartDate,
    taskEndDate,
    categoryId,
    taskNote,
    userId,
    taskFavorite,
    taskDone,
  );
  return createdTask.id;
};

const userId = Types.ObjectId().toHexString();
const categoryId = Types.ObjectId().toHexString();
let taskId: string;
const taskTitle = 'title';
const taskNote = 'note';
const taskStartDate: Date = new Date();
const taskEndDate: Date = new Date();
const taskFavorite = true;
const taskDone = false;
