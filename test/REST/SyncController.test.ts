import { expect } from 'chai';
import { describe } from 'mocha';
import request from 'supertest';
import bodyParser from 'body-parser';
import express, { Application } from 'express';
import routes from '../../src/REST/Routes';
import * as InMemoryMongo from '../InMemoryMongo';
import * as UserManager from '../../src/business/UserManager';
import { UserDocument } from '../../src/DAO/documents/UserDocument';
import * as TaskManager from '../../src/business/TaskManager';
import * as NoteManager from '../../src/business/NoteManager';
import * as CategoryManager from '../../src/business/CategoryManager';

describe('Task Controller', () => {
  let server: Application;
  const url = '/api/v1/sync/';

  before(async () => {
    await InMemoryMongo.connect();
    server = express();
    server.use(bodyParser.json());
    server.use('/api/v1', routes);
  });

  beforeEach(async () => await createUserAndLoginBeforeTest());

  afterEach(async () => await InMemoryMongo.clearDatabase());

  after(async () => await InMemoryMongo.closeDatabase());

  describe('POST /', () => {
    it('should return 200 and arrays', async () => {
      await NoteManager.create('title', 'text', '#ffffff', loginResult.user.id);
      await TaskManager.create(
        'title',
        new Date(),
        new Date(),
        undefined,
        'note',
        loginResult.user.id,
      );
      await CategoryManager.create('text', loginResult.user.id);
      return request(server)
        .post(url)
        .set('Authorization', loginResult.token)
        .send({ notes: [], tasks: [], categories: [] })
        .expect(200)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body).to.have.property('notes');
          expect(response.body).to.have.property('tasks');
          expect(response.body).to.have.property('categories');
          expect(response.body.notes).to.be.a('array');
          expect(response.body.tasks).to.be.a('array');
          expect(response.body.categories).to.be.a('array');
          expect(response.body.notes.length).to.be.equal(1);
          expect(response.body.tasks.length).to.be.equal(1);
          expect(response.body.categories.length).to.be.equal(1);
        });
    });

    it('should return 204 if nothing send and nothing to return', async () => {
      return request(server)
        .post(url)
        .set('Authorization', loginResult.token)
        .send({ notes: [], tasks: [], categories: [] })
        .expect(204);
    });

    it('should return 204 if data send and nothing to return', async () => {
      const note = { title: 'title', text: 'text', color: '#ffffff' };
      const task = {
        title: 'title',
        startDate: new Date(),
        endDate: new Date(),
        note: 'note',
      };
      const category = { text: 'text' };
      return request(server)
        .post(url)
        .set('Authorization', loginResult.token)
        .send({ notes: [note], tasks: [task], categories: [category] })
        .expect(204);
    });

    it('should return 200 if data send and data return', async () => {
      await NoteManager.create(
        'title',
        'text',
        '#ffffff',
        loginResult.user.id,
        new Date(),
        new Date(),
      );
      await TaskManager.create(
        'title',
        new Date(),
        new Date(),
        undefined,
        'note',
        loginResult.user.id,
        false,
        false,
        new Date(),
      );
      await CategoryManager.create('text', loginResult.user.id);
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
      return request(server)
        .post(url)
        .set('Authorization', loginResult.token)
        .send({ notes: [note], tasks: [task], categories: [category] })
        .expect(200)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body).to.have.property('notes');
          expect(response.body).to.have.property('tasks');
          expect(response.body).to.have.property('categories');
          expect(response.body.notes).to.be.a('array');
          expect(response.body.tasks).to.be.a('array');
          expect(response.body.categories).to.be.a('array');
          expect(response.body.notes.length).to.be.equal(1);
          expect(response.body.tasks.length).to.be.equal(1);
          expect(response.body.categories.length).to.be.equal(1);
        });
    });

    it('should return 204 if data send and nothing to return', async () => {
      const createdNote = await NoteManager.create(
        'title',
        'text',
        '#ffffff',
        loginResult.user.id,
        new Date(),
        new Date(),
      );
      const createdTask = await TaskManager.create(
        'title',
        new Date(),
        new Date(),
        undefined,
        'note',
        loginResult.user.id,
        false,
        false,
        new Date(),
      );
      const createdCategory = await CategoryManager.create(
        'text',
        loginResult.user.id,
      );
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
      return request(server)
        .post(url)
        .set('Authorization', loginResult.token)
        .send({ notes: [note], tasks: [task], categories: [category] })
        .expect(204);
    });

    it('should return 400 & response invalid token', async () => {
      return request(server)
        .post(url)
        .set('Authorization', 'test')
        .send({ title: 'title' })
        .expect(400)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.message).to.be.equal('Invalid token.');
        });
    });

    it('should return 401 & response no token provided', async () => {
      return request(server)
        .post(url)
        .send({ title: 'title' })
        .expect(401)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.message).to.be.equal(
            'Access denied. No token provided.',
          );
        });
    });
  });
});

const createUserAndLoginBeforeTest = async (): Promise<void> => {
  await UserManager.register({
    login: userLogin,
    email: userEmail,
    password: userPassword,
  } as UserDocument);
  loginResult = await UserManager.authenticate(
    userLogin,
    userPassword,
    deviceName,
  );
};

const userLogin = 'userLogin';
const userEmail = 'userEmail';
const userPassword = 'userPassword';
const deviceName = 'deviceName';
let loginResult: {
  token: string;
  user: {
    id: string;
    login: string;
    email: string;
  };
};
