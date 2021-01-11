import { expect } from 'chai';
import { describe } from 'mocha';
import request from 'supertest';
import bodyParser from 'body-parser';
import express, { Application } from 'express';
import routes from '../../src/REST/Routes';
import * as InMemoryMongo from '../InMemoryMongo';
import * as UserManager from '../../src/business/UserManager';
import { UserDocument } from '../../src/DAO/documents/UserDocument';
import * as NoteManager from '../../src/business/NoteManager';

describe('Note Controller', () => {
  let server: Application;
  const url = '/api/v1/note/';

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
    it('should return 201 & valid response', async () => {
      return request(server)
        .post(url)
        .set('Authorization', loginResult.token)
        .send({ title: 'title' })
        .expect(201)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.title).to.be.equal('title');
        });
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

  describe('GET /', () => {
    it('should return 404 if notes not found', async () => {
      return request(server)
        .get(url)
        .set('Authorization', loginResult.token)
        .expect('Content-Type', /json/)
        .expect(404)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.message).to.be.equal('Notes not found');
        });
    });

    it('should return 200 & response one note in array', async () => {
      await NoteManager.create('title', 'text', '#ffffff', loginResult.user.id);
      return request(server)
        .get(url)
        .set('Authorization', loginResult.token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).to.be.a('array');
          expect(response.body.length).to.be.equal(1);
        });
    });
  });

  describe('GET /search/:searchText', () => {
    it('should return 404 if notes not found', async () => {
      return request(server)
        .get(url + 'search/a')
        .set('Authorization', loginResult.token)
        .expect('Content-Type', /json/)
        .expect(404)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.message).to.be.equal('Notes not found');
        });
    });
    it('should return 200 & response one note in array', async () => {
      await NoteManager.create('title', 'text', '#ffffff', loginResult.user.id);
      await NoteManager.create('a', 'a', '#ffffff', loginResult.user.id);
      return request(server)
        .get(url + 'search/a')
        .set('Authorization', loginResult.token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).to.be.a('array');
          expect(response.body.length).to.be.equal(1);
          expect(response.body[0].title).to.be.equal('a');
        });
    });
  });

  describe('DELETE /:id', () => {
    it('should return 204', async () => {
      const createdNote = await NoteManager.create(
        'title',
        'text',
        '#ffffff',
        loginResult.user.id,
      );
      return request(server)
        .delete(url + createdNote.id)
        .set('Authorization', loginResult.token)
        .expect(204);
    });

    it('should return 404 if note not found', async () => {
      return request(server)
        .delete(url + 'test')
        .set('Authorization', loginResult.token)
        .expect(404)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.message).to.be.equal('Note not found');
        });
    });
  });

  describe('DELETE /', () => {
    it('should return 204', async () => {
      const createdNote1 = await NoteManager.create(
        'title',
        'text',
        '#ffffff',
        loginResult.user.id,
      );
      const createdNote2 = await NoteManager.create(
        'title2',
        'text2',
        '#ffffff',
        loginResult.user.id,
      );
      return request(server)
        .delete(url.substring(0, url.length - 1))
        .set('Authorization', loginResult.token)
        .query('ids=' + createdNote1.id + ',' + createdNote2.id)
        .expect(204);
    });

    it('should return 404 if invalid query string', async () => {
      return request(server)
        .delete(url.substring(0, url.length - 1))
        .set('Authorization', loginResult.token)
        .query('id')
        .expect(400)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.message).to.be.equal(
            'Invalid request query parameter',
          );
        });
    });

    it('should return 404 if no query string', async () => {
      return request(server)
        .delete(url.substring(0, url.length - 1))
        .set('Authorization', loginResult.token)
        .expect(400)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.message).to.be.equal(
            'Invalid request query parameter',
          );
        });
    });
  });

  describe('PATCH /:id/title/:title', () => {
    it('should return 204', async () => {
      const createdNote1 = await NoteManager.create(
        'title',
        'text',
        '#ffffff',
        loginResult.user.id,
      );
      return request(server)
        .patch(url + createdNote1.id + '/title/newTitle')
        .set('Authorization', loginResult.token)
        .expect(204);
    });

    it('should return 404', async () => {
      return request(server)
        .patch(url + 'unknown/title/newTitle')
        .set('Authorization', loginResult.token)
        .expect(404);
    });
  });

  describe('PATCH /:id/text/:text', () => {
    it('should return 204', async () => {
      const createdNote1 = await NoteManager.create(
        'title',
        'text',
        '#ffffff',
        loginResult.user.id,
      );
      return request(server)
        .patch(url + createdNote1.id + '/text/newText')
        .set('Authorization', loginResult.token)
        .expect(204);
    });

    it('should return 404', async () => {
      return request(server)
        .patch(url + 'unknown/text/newText')
        .set('Authorization', loginResult.token)
        .expect(404);
    });
  });

  describe('PATCH /:id/color/:color', () => {
    it('should return 204', async () => {
      const createdNote1 = await NoteManager.create(
        'title',
        'text',
        '#ffffff',
        loginResult.user.id,
      );
      return request(server)
        .patch(url + createdNote1.id + '/color/%23000000')
        .set('Authorization', loginResult.token)
        .expect(204);
    });

    it('should return 404', async () => {
      return request(server)
        .patch(url + 'unknown/color/%23000000')
        .set('Authorization', loginResult.token)
        .expect(404);
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
