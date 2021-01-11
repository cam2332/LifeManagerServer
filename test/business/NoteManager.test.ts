import { expect } from 'chai';
import { describe } from 'mocha';
import { Types } from 'mongoose';
import * as InMemoryMongo from '../InMemoryMongo';
import * as NoteManager from '../../src/business/NoteManager';
import ApplicationError from '../../src/service/ApplicationError';

describe('Note Manager', () => {
  before(async () => await InMemoryMongo.connect());

  beforeEach(async () => await createNoteBeforeTest());

  afterEach(async () => await InMemoryMongo.clearDatabase());

  after(async () => await InMemoryMongo.closeDatabase());

  it('should create a note', async () => {
    const createdNote = await NoteManager.create(
      noteTitle,
      noteText,
      noteColor,
      userId,
    );

    expect(createdNote.title).to.be.equal(noteTitle);
    expect(createdNote.text).to.be.equal(noteText);
    expect(createdNote.color).to.be.equal(noteColor);
    expect(createdNote.userId).to.be.eql(Types.ObjectId(userId));
  });

  it('should create a note with only title and userId', async () => {
    const createdNote = await NoteManager.create(
      noteTitle,
      undefined,
      undefined,
      userId,
    );

    expect(createdNote.title).to.be.equal(noteTitle);
    expect(createdNote.text).to.be.equal('');
    expect(createdNote.color).to.be.equal('');
    expect(createdNote.userId).to.be.eql(Types.ObjectId(userId));
  });

  it('should get notes by user id', async () => {
    const foundNotes = await NoteManager.getAll(userId);
    expect(foundNotes.length).to.be.equal(1);
    expect(foundNotes[0].id).to.be.equal(noteId);
  });

  it('should throw error if no user id is provided', async () => {
    try {
      await NoteManager.getAll('');
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Notes not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it('should get notes by user id and title', async () => {
    const foundNotes = await NoteManager.getAllByTitleAndText(
      userId,
      noteTitle,
    );
    expect(foundNotes.length).to.be.equal(1);
    expect(foundNotes[0].id).to.be.equal(noteId);
    expect(foundNotes[0].title).to.be.equal(noteTitle);
  });

  it('should throw error if no user id and title', async () => {
    try {
      await NoteManager.getAllByTitleAndText('', '');
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Notes not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it('should delete note by id', async () => {
    expect(await NoteManager.deleteById(noteId)).to.be.equal(true);
    try {
      await NoteManager.getAll(userId);
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Notes not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it('should throw error if invalid note id', async () => {
    try {
      await NoteManager.deleteById(Types.ObjectId().toHexString());
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Note not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it('should throw error if no note id', async () => {
    try {
      await NoteManager.deleteById('');
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Note not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it('should delete notes by ids', async () => {
    const newNoteId = await createNote();
    expect(await NoteManager.deleteByIds([noteId, newNoteId])).to.be.equal(
      true,
    );
    try {
      await NoteManager.getAll(userId);
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Notes not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it('should throw error if invalid notes ids', async () => {
    try {
      await NoteManager.deleteByIds([Types.ObjectId().toHexString()]);
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Notes not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it('should update note title', async () => {
    const updatedNote = await NoteManager.updateTitle(noteId, 'new title');
    expect(updatedNote.title).to.be.equal('new title');
  });

  it('should not update note title if no user id', async () => {
    try {
      await NoteManager.updateTitle('', '');
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Note not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it('should update note text', async () => {
    const newText = 'new text';
    const updatedNote = await NoteManager.updateText(noteId, newText);
    expect(updatedNote.text).to.be.equal(newText);
  });

  it('should not update note text if no note id provided', async () => {
    try {
      await NoteManager.updateText('', 'new text');
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Note not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it('should update note color', async () => {
    const newColor = '#000000';
    const updatedNote = await NoteManager.updateColor(noteId, newColor);
    expect(updatedNote.color).to.be.equal(newColor);
  });

  it('should not update note color if no note id provided', async () => {
    try {
      await NoteManager.updateColor('', '#000000');
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Note not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });
});

const createNoteBeforeTest = async (): Promise<void> => {
  noteId = await createNote();
};

const createNote = async (): Promise<string> => {
  const createdNote = await NoteManager.create(
    noteTitle,
    noteText,
    noteColor,
    userId,
  );
  return createdNote.id;
};

const userId = Types.ObjectId().toHexString();
let noteId: string;
const noteTitle = 'title';
const noteText = 'text';
const noteColor = '#ffffff';
