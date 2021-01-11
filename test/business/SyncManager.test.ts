import { expect } from 'chai';
import { describe } from 'mocha';
import { Types } from 'mongoose';
import * as InMemoryMongo from '../InMemoryMongo';
import * as TaskManager from '../../src/business/TaskManager';
import * as NoteManager from '../../src/business/NoteManager';
import * as CategoryManager from '../../src/business/CategoryManager';
import * as SyncManager from '../../src/business/SyncManager';

describe('SyncManager', () => {
  before(async () => await InMemoryMongo.connect());

  afterEach(async () => await InMemoryMongo.clearDatabase());

  after(async () => await InMemoryMongo.closeDatabase());

  it('should return empty arrays if request arrays are empty and database is empty', async () => {
    const userId = Types.ObjectId().toHexString();

    const syncResult = await SyncManager.sync([], [], [], userId);

    expect(syncResult).to.eql({
      notes: [],
      tasks: [],
      categories: [],
    });
    expect(syncResult).to.be.a('object');
    expect(syncResult).to.have.property('notes');
    expect(syncResult).to.have.property('tasks');
    expect(syncResult).to.have.property('categories');
    expect(syncResult.notes).to.be.a('array');
    expect(syncResult.tasks).to.be.a('array');
    expect(syncResult.categories).to.be.a('array');
    expect(syncResult.notes.length).to.be.equal(0);
    expect(syncResult.tasks.length).to.be.equal(0);
    expect(syncResult.categories.length).to.be.equal(0);
  });

  it('should return arrays if request arrays are empty and database have records', async () => {
    const userId = Types.ObjectId().toHexString();
    await NoteManager.create('title', 'text', '#ffffff', userId);
    await TaskManager.create(
      'title',
      new Date(),
      new Date(),
      undefined,
      'note',
      userId,
    );
    await CategoryManager.create('text', userId);

    const syncResult = await SyncManager.sync([], [], [], userId);
    expect(syncResult).to.be.a('object');
    expect(syncResult).to.have.property('notes');
    expect(syncResult).to.have.property('tasks');
    expect(syncResult).to.have.property('categories');
    expect(syncResult.notes).to.be.a('array');
    expect(syncResult.tasks).to.be.a('array');
    expect(syncResult.categories).to.be.a('array');
    expect(syncResult.notes.length).to.be.equal(1);
    expect(syncResult.tasks.length).to.be.equal(1);
    expect(syncResult.categories.length).to.be.equal(1);
  });

  it('should return empty arrays if request arrays have records and database is empty', async () => {
    const userId = Types.ObjectId().toHexString();
    const note = { title: 'title', text: 'text', color: '#ffffff' };
    const task = {
      title: 'title',
      startDate: new Date(),
      endDate: new Date(),
      note: 'note',
    };
    const category = { text: 'text' };

    const syncResult = await SyncManager.sync(
      [note],
      [task],
      [category],
      userId,
    );
    expect(syncResult).to.be.a('object');
    expect(syncResult).to.have.property('notes');
    expect(syncResult).to.have.property('tasks');
    expect(syncResult).to.have.property('categories');
    expect(syncResult.notes).to.be.a('array');
    expect(syncResult.tasks).to.be.a('array');
    expect(syncResult.categories).to.be.a('array');
    expect(syncResult.notes.length).to.be.equal(0);
    expect(syncResult.tasks.length).to.be.equal(0);
    expect(syncResult.categories.length).to.be.equal(0);
  });

  it('should return arrays if request arrays have records and database have records', async () => {
    const userId = Types.ObjectId().toHexString();
    await NoteManager.create(
      'title',
      'text',
      '#ffffff',
      userId,
      new Date(),
      new Date(),
    );
    await TaskManager.create(
      'title',
      new Date(),
      new Date(),
      undefined,
      'note',
      userId,
      false,
      false,
      new Date(),
    );
    await CategoryManager.create('text', userId);
    const note = {
      title: 'title',
      text: 'text',
      color: '#ffffff',
      lastEditDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    };
    const task = {
      title: 'title',
      startDate: new Date(),
      endDate: new Date(),
      note: 'note',
      lastEditDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    };
    const category = { text: 'text' };

    const syncResult = await SyncManager.sync(
      [note],
      [task],
      [category],
      userId,
    );
    expect(syncResult).to.be.a('object');
    expect(syncResult).to.have.property('notes');
    expect(syncResult).to.have.property('tasks');
    expect(syncResult).to.have.property('categories');
    expect(syncResult.notes).to.be.a('array');
    expect(syncResult.tasks).to.be.a('array');
    expect(syncResult.categories).to.be.a('array');
    expect(syncResult.notes.length).to.be.equal(1);
    expect(syncResult.tasks.length).to.be.equal(1);
    expect(syncResult.categories.length).to.be.equal(1);
  });

  it('should return empty arrays if request arrays have records and database have records', async () => {
    const userId = Types.ObjectId().toHexString();
    const createdNote = await NoteManager.create(
      'title',
      'text',
      '#ffffff',
      userId,
      new Date(),
      new Date(),
    );
    const createdTask = await TaskManager.create(
      'title',
      new Date(),
      new Date(),
      undefined,
      'note',
      userId,
      false,
      false,
      new Date(),
    );
    const createdCategory = await CategoryManager.create('text', userId);
    const note = {
      id: createdNote.id,
      title: 'title',
      text: 'text',
      color: '#ffffff',
      lastEditDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    };
    const task = {
      id: createdTask.id,
      title: 'title',
      startDate: new Date(),
      endDate: new Date(),
      note: 'note',
      lastEditDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    };
    const category = { id: createdCategory.id, text: 'text' };

    const syncResult = await SyncManager.sync(
      [note],
      [task],
      [category],
      userId,
    );
    expect(syncResult).to.be.a('object');
    expect(syncResult).to.have.property('notes');
    expect(syncResult).to.have.property('tasks');
    expect(syncResult).to.have.property('categories');
    expect(syncResult.notes).to.be.a('array');
    expect(syncResult.tasks).to.be.a('array');
    expect(syncResult.categories).to.be.a('array');
    expect(syncResult.notes.length).to.be.equal(0);
    expect(syncResult.tasks.length).to.be.equal(0);
    expect(syncResult.categories.length).to.be.equal(0);
  });
});
