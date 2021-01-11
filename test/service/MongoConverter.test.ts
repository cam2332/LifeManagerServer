import { expect } from 'chai';
import { Types } from 'mongoose';
import { CategoryDocument } from '../../src/DAO/documents/CategoryDocument';
import { NoteDocument } from '../../src/DAO/documents/NoteDocument';
import { TaskDocument } from '../../src/DAO/documents/TaskDocument';
import { UserDocument } from '../../src/DAO/documents/UserDocument';
import * as MongoConverter from '../../src/service/MongoConverter';

describe('MongoConverter tests', () => {
  describe('user', () => {
    const id = Types.ObjectId(),
      login = 'test',
      email = 'test',
      displayName = 'Test',
      profileImageUrl = 'http://test';
    let user: UserDocument;

    before(() => {
      user = {
        id,
        login,
        email,
        displayName,
        profileImageUrl,
      } as UserDocument;
    });

    it('should correctly convert user document to properties', () => {
      const objectFromUser = MongoConverter.fromUser(user);
      expect(objectFromUser.id).to.equal(id);
      expect(objectFromUser.login).to.equal(login);
      expect(objectFromUser.email).to.equal(email);
      expect(objectFromUser.displayName).to.equal(displayName);
      expect(objectFromUser.profileImageUrl).to.equal(profileImageUrl);
    });
  });

  describe('note', () => {
    let note: NoteDocument;
    const userId = Types.ObjectId(),
      noteId = Types.ObjectId(),
      title = 'test title',
      text = 'test text',
      color = '#000000';

    before(() => {
      note = {
        id: noteId,
        title,
        text,
        color,
        userId,
      } as NoteDocument;
    });

    it('should correctly convert properties to NoteDocument', () => {
      const taskFromProperties = MongoConverter.toNote(
        noteId.toHexString(),
        title,
        text,
        userId.toHexString(),
        color,
      );
      expect(taskFromProperties._id.toHexString()).to.equal(
        noteId.toHexString(),
      );
      expect(taskFromProperties.title).to.equal(title);
      expect(taskFromProperties.text).to.equal(text);
      expect(taskFromProperties.color).to.equal(color);
      expect(taskFromProperties.userId.toHexString()).to.equal(
        userId.toHexString(),
      );
    });

    it('should correctly convert array of properties to array of NoteDocuments', () => {
      const noteObjects = [
        { title, text, color },
        { title, text, color },
        { title, text, color },
      ];
      const notesFromProperties = MongoConverter.toNoteArray(
        noteObjects,
        userId.toHexString(),
      );
      expect(notesFromProperties.length).to.equal(noteObjects.length);
    });

    it('should correctly convert NoteDocument to object', () => {
      const objectFromNote = MongoConverter.fromNote(note);
      expect(objectFromNote.id).to.equal(noteId);
      expect(objectFromNote.title).to.equal(title);
      expect(objectFromNote.text).to.equal(text);
      expect(objectFromNote.color).to.equal(color);
    });

    it('should correctly convert array of Note documents to array of objects', () => {
      const objectsFromNotes = MongoConverter.fromNoteArray([note, note]);
      expect(objectsFromNotes.length).to.equal(2);
    });
  });

  describe('task', () => {
    let task: TaskDocument;
    const userId = Types.ObjectId(),
      taskId = Types.ObjectId(),
      taskTitle = 'test',
      taskStartDate = new Date(),
      taskEndDate = new Date(),
      taskCategoryId = Types.ObjectId(),
      taskFavorite = false,
      taskDone = false,
      taskNote = 'test';

    before(() => {
      task = {
        id: taskId,
        title: taskTitle,
        startDate: taskStartDate,
        endDate: taskEndDate,
        categoryId: taskCategoryId,
        favorite: taskFavorite,
        done: taskDone,
        note: taskNote,
        userId,
      } as TaskDocument;
    });

    it('should correctly convert properties to TaskDocument', () => {
      const taskFromProperties = MongoConverter.toTask(
        taskId.toHexString(),
        taskTitle,
        taskStartDate,
        taskEndDate,
        taskCategoryId.toHexString(),
        userId.toHexString(),
        taskNote,
        taskFavorite,
        taskDone,
      );
      expect(taskFromProperties._id.toHexString()).to.equal(
        taskId.toHexString(),
      );
      expect(taskFromProperties.title).to.equal(taskTitle);
      expect(taskFromProperties.startDate).to.equal(taskStartDate);
      expect(taskFromProperties.endDate).to.equal(taskEndDate);
      expect(taskFromProperties.categoryId?.toHexString()).to.equal(
        taskCategoryId.toHexString(),
      );
      expect(taskFromProperties.favorite).to.equal(taskFavorite);
      expect(taskFromProperties.done).to.equal(taskDone);
      expect(taskFromProperties.note).to.equal(taskNote);
    });

    it('should correctly convert array of properties to array of TaskDocuments', () => {
      const taskObjects = [
        {
          title: taskTitle,
          startDate: taskStartDate,
          endDate: taskEndDate,
          note: taskNote,
        },
        { title: taskTitle, startDate: taskStartDate, note: taskNote },
        { title: taskTitle, note: taskNote, favorite: taskFavorite },
      ];
      const tasksFromProperties = MongoConverter.toTaskArray(
        taskObjects,
        userId.toHexString(),
      );
      expect(tasksFromProperties.length).to.equal(taskObjects.length);
    });

    it('should correctly convert TaskDocument to object', () => {
      const objectFromTask = MongoConverter.fromTask(task);
      expect(objectFromTask.id).to.equal(taskId);
      expect(objectFromTask.title).to.equal(taskTitle);
      expect(objectFromTask.startDate).to.equal(taskStartDate);
      expect(objectFromTask.endDate).to.equal(taskEndDate);
      expect(objectFromTask.categoryId).to.equal(taskCategoryId.toHexString());
      expect(objectFromTask.favorite).to.equal(taskFavorite);
      expect(objectFromTask.done).to.equal(taskDone);
      expect(objectFromTask.note).to.equal(taskNote);
    });

    it('should correctly convert array of Task documents to array of objects', () => {
      const objectsFromTasks = MongoConverter.fromTaskArray([task, task]);
      expect(objectsFromTasks.length).to.equal(2);
    });
  });

  describe('category', () => {
    let category: CategoryDocument;
    const userId = Types.ObjectId(),
      categoryId = Types.ObjectId(),
      text = 'text',
      color = '#ffffff',
      icon = 'icon';

    before(() => {
      category = {
        id: categoryId,
        text,
        color,
        icon,
        userId,
      } as CategoryDocument;
    });

    it('should correctly convert properties to CategoryDocument', () => {
      const categoryFromProperties = MongoConverter.toCategory(
        categoryId.toHexString(),
        text,
        userId.toHexString(),
        color,
        icon,
      );
      expect(categoryFromProperties._id.toHexString()).to.equal(
        categoryId.toHexString(),
      );
      expect(categoryFromProperties.text).to.equal(text);
      expect(categoryFromProperties.color).to.equal(color);
      expect(categoryFromProperties.icon).to.equal(icon);
      expect(categoryFromProperties.userId.toHexString()).to.equal(
        userId.toHexString(),
      );
    });

    it('should correctly convert array of objects to array of CategoryDocuments', () => {
      const categoryObjects = [
        { text, color, userId: userId.toHexString(), icon },
        { text, color, userId: userId.toHexString() },
        { text, color },
      ];
      const categoriesFromObjects = MongoConverter.toCategoryArray(
        categoryObjects,
        userId.toHexString(),
      );
      expect(categoriesFromObjects.length).to.equal(categoryObjects.length);
    });

    it('should correctly convert CategoryDocument to object', () => {
      const objectFromCategory = MongoConverter.fromCategory(category);
      expect(objectFromCategory.id).to.equal(categoryId);
      expect(objectFromCategory.text).to.equal(text);
      expect(objectFromCategory.color).to.equal(color);
      expect(objectFromCategory.icon).to.equal(icon);
    });

    it('should correctly convert array of CategoryDocuments to array of objects', () => {
      const objectsFromCategories = MongoConverter.fromCategoryArray([
        category,
        category,
      ]);
      expect(objectsFromCategories.length).to.equal(2);
    });
  });
});
