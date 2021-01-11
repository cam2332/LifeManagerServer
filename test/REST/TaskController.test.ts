import { expect } from 'chai';
import { describe } from 'mocha';
import { Types } from 'mongoose';
import request from 'supertest';
import bodyParser from 'body-parser';
import express, { Application } from 'express';
import routes from '../../src/REST/Routes';
import * as InMemoryMongo from '../InMemoryMongo';
import * as UserManager from '../../src/business/UserManager';
import { UserDocument } from '../../src/DAO/documents/UserDocument';
import * as TaskManager from '../../src/business/TaskManager';

describe('Task Controller', () => {
  let server: Application;
  const url = '/api/v1/task/';

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
    it('should return 404 if tasks not found', async () => {
      return request(server)
        .get(url)
        .set('Authorization', loginResult.token)
        .expect('Content-Type', /json/)
        .expect(404)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.message).to.be.equal('Tasks not found');
        });
    });

    it('should return 200 & response one task in array', async () => {
      await TaskManager.create(
        'title',
        new Date(),
        new Date(),
        undefined,
        'note',
        loginResult.user.id,
      );
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

  describe('GET /search', () => {
    it('should return 404 if tasks not found', async () => {
      return request(server)
        .get(url + 'search')
        .set('Authorization', loginResult.token)
        .expect('Content-Type', /json/)
        .expect(404)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.message).to.be.equal('Tasks not found');
        });
    });

    it('should return 200 & response one task in array (searchText, categoryId)', async () => {
      const createdTask = await TaskManager.create(
        'title',
        new Date(),
        new Date(),
        Types.ObjectId().toHexString(),
        'note',
        loginResult.user.id,
      );
      return request(server)
        .get(url + 'search')
        .set('Authorization', loginResult.token)
        .query({
          searchText: 't',
          categoryId: createdTask.categoryId?.toHexString(),
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).to.be.a('array');
          expect(response.body.length).to.be.equal(1);
        });
    });

    it('should return 200 & response one task in array (searchText)', async () => {
      await TaskManager.create(
        'title',
        new Date(),
        new Date(),
        undefined,
        'note',
        loginResult.user.id,
      );
      return request(server)
        .get(url + 'search')
        .set('Authorization', loginResult.token)
        .query({ searchText: 't' })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).to.be.a('array');
          expect(response.body.length).to.be.equal(1);
        });
    });

    it('should return 200 & response one task in array (categoryId)', async () => {
      const createdTask = await TaskManager.create(
        'title',
        new Date(),
        new Date(),
        Types.ObjectId().toHexString(),
        'note',
        loginResult.user.id,
      );
      return request(server)
        .get(url + 'search')
        .set('Authorization', loginResult.token)
        .query({
          categoryId: createdTask.categoryId?.toHexString(),
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).to.be.a('array');
          expect(response.body.length).to.be.equal(1);
        });
    });
  });

  describe('DELETE /:id', () => {
    it('should return 204', async () => {
      const createdTask = await TaskManager.create(
        'title',
        new Date(),
        new Date(),
        undefined,
        'note',
        loginResult.user.id,
      );
      return request(server)
        .delete(url + createdTask.id)
        .set('Authorization', loginResult.token)
        .expect(204);
    });

    it('should return 404 if task not found', async () => {
      return request(server)
        .delete(url + 'test')
        .set('Authorization', loginResult.token)
        .expect(404)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.message).to.be.equal('Task not found');
        });
    });
  });

  describe('DELETE /', () => {
    it('should return 204', async () => {
      const createdTask1 = await TaskManager.create(
        'title',
        new Date(),
        new Date(),
        Types.ObjectId().toHexString(),
        'note',
        loginResult.user.id,
      );
      const createdTask2 = await TaskManager.create(
        'title',
        new Date(),
        new Date(),
        undefined,
        'note',
        loginResult.user.id,
      );
      return request(server)
        .delete(url.substring(0, url.length - 1))
        .set('Authorization', loginResult.token)
        .query('ids=' + createdTask1.id + ',' + createdTask2.id)
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
      const createdTask = await TaskManager.create(
        'title',
        new Date(),
        new Date(),
        undefined,
        'note',
        loginResult.user.id,
      );
      return request(server)
        .patch(url + createdTask.id + '/title/newTitle')
        .set('Authorization', loginResult.token)
        .expect(204);
    });

    it('should return 404', async () => {
      return request(server)
        .patch(url + 'unknown/title/newTitle')
        .set('Authorization', loginResult.token)
        .expect(404)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.message).to.be.equal('Task not found');
        });
    });
  });

  describe('PATCH /:id/start-date/:startDate', () => {
    it('should return 204', async () => {
      const createdTask = await TaskManager.create(
        'title',
        new Date(),
        new Date(),
        undefined,
        'note',
        loginResult.user.id,
      );
      return request(server)
        .patch(url + createdTask.id + '/start-date/' + new Date().toISOString())
        .set('Authorization', loginResult.token)
        .expect(204);
    });

    it('should return 404 if task not found', async () => {
      return request(server)
        .patch(url + 'unknown/start-date/' + new Date().toISOString())
        .set('Authorization', loginResult.token)
        .expect(404)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.message).to.be.equal('Task not found');
        });
    });

    it('should return 400 if invalid date format', async () => {
      const createdTask = await TaskManager.create(
        'title',
        new Date(),
        new Date(),
        undefined,
        'note',
        loginResult.user.id,
      );
      return request(server)
        .patch(url + createdTask.id + '/start-date/' + 'test')
        .set('Authorization', loginResult.token)
        .expect(400)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.message).to.be.equal('Invalid date format');
        });
    });
  });

  describe('PATCH /:id/end-date/:endDate', () => {
    it('should return 204', async () => {
      const createdTask = await TaskManager.create(
        'title',
        new Date(),
        new Date(),
        undefined,
        'note',
        loginResult.user.id,
      );
      return request(server)
        .patch(url + createdTask.id + '/end-date/' + new Date().toISOString())
        .set('Authorization', loginResult.token)
        .expect(204);
    });

    it('should return 404 if task not found', async () => {
      return request(server)
        .patch(url + 'unknown/end-date/' + new Date().toISOString())
        .set('Authorization', loginResult.token)
        .expect(404)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.message).to.be.equal('Task not found');
        });
    });

    it('should return 400 if invalid date format', async () => {
      const createdTask = await TaskManager.create(
        'title',
        new Date(),
        new Date(),
        undefined,
        'note',
        loginResult.user.id,
      );
      return request(server)
        .patch(url + createdTask.id + '/end-date/' + 'test')
        .set('Authorization', loginResult.token)
        .expect(400)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.message).to.be.equal('Invalid date format');
        });
    });
  });

  describe('PATCH /:id/category-id/:categoryId', () => {
    it('should return 204', async () => {
      const createdTask = await TaskManager.create(
        'title',
        new Date(),
        new Date(),
        undefined,
        'note',
        loginResult.user.id,
      );
      return request(server)
        .patch(
          url +
            createdTask.id +
            '/category-id/' +
            Types.ObjectId().toHexString(),
        )
        .set('Authorization', loginResult.token)
        .expect(204);
    });

    it('should return 404 if task not found', async () => {
      return request(server)
        .patch(url + 'unknown/category-id/categoryid')
        .set('Authorization', loginResult.token)
        .expect(404)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.message).to.be.equal('Task not found');
        });
    });
  });

  describe('PATCH /:id/note/:note', () => {
    it('should return 204', async () => {
      const createdTask = await TaskManager.create(
        'title',
        new Date(),
        new Date(),
        undefined,
        'note',
        loginResult.user.id,
      );
      return request(server)
        .patch(url + createdTask.id + '/note/newNote')
        .set('Authorization', loginResult.token)
        .expect(204);
    });

    it('should return 404', async () => {
      return request(server)
        .patch(url + 'unknown/note/newNote')
        .set('Authorization', loginResult.token)
        .expect(404)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.message).to.be.equal('Task not found');
        });
    });
  });

  describe('PATCH /:id/favorite/:favorite', () => {
    it('should return 204 if value is true', async () => {
      const createdTask = await TaskManager.create(
        'title',
        new Date(),
        new Date(),
        undefined,
        'note',
        loginResult.user.id,
      );
      return request(server)
        .patch(url + createdTask.id + '/favorite/true')
        .set('Authorization', loginResult.token)
        .expect(204);
    });

    it('should return 204 if value if false', async () => {
      const createdTask = await TaskManager.create(
        'title',
        new Date(),
        new Date(),
        undefined,
        'note',
        loginResult.user.id,
      );
      return request(server)
        .patch(url + createdTask.id + '/favorite/false')
        .set('Authorization', loginResult.token)
        .expect(204);
    });

    it('should return 404 if task not found', async () => {
      return request(server)
        .patch(url + 'unknown/favorite/true')
        .set('Authorization', loginResult.token)
        .expect(404)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.message).to.be.equal('Task not found');
        });
    });
  });

  describe('PATCH /:id/done/:done', () => {
    it('should return 204 if value is true', async () => {
      const createdTask = await TaskManager.create(
        'title',
        new Date(),
        new Date(),
        undefined,
        'note',
        loginResult.user.id,
      );
      return request(server)
        .patch(url + createdTask.id + '/done/true')
        .set('Authorization', loginResult.token)
        .expect(204);
    });

    it('should return 204 if value if false', async () => {
      const createdTask = await TaskManager.create(
        'title',
        new Date(),
        new Date(),
        undefined,
        'note',
        loginResult.user.id,
      );
      return request(server)
        .patch(url + createdTask.id + '/done/false')
        .set('Authorization', loginResult.token)
        .expect(204);
    });

    it('should return 404 if task not found', async () => {
      return request(server)
        .patch(url + 'unknown/done/true')
        .set('Authorization', loginResult.token)
        .expect(404)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.message).to.be.equal('Task not found');
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
