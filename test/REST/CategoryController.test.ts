import { expect } from 'chai';
import { describe } from 'mocha';
import request from 'supertest';
import bodyParser from 'body-parser';
import express, { Application } from 'express';
import routes from '../../src/REST/Routes';
import * as InMemoryMongo from '../InMemoryMongo';
import * as UserManager from '../../src/business/UserManager';
import { UserDocument } from '../../src/DAO/documents/UserDocument';
import * as CategoryManager from '../../src/business/CategoryManager';

describe('Category Controller', () => {
  let server: Application;
  const url = '/api/v1/category/';

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
        .send({ text: 'text' })
        .expect(201)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.text).to.be.equal('text');
        });
    });

    it('should return 400 & response invalid token', async () => {
      return request(server)
        .post(url)
        .set('Authorization', 'test')
        .send({ text: 'text' })
        .expect(400)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.message).to.be.equal('Invalid token.');
        });
    });

    it('should return 401 & response no token provided', async () => {
      return request(server)
        .post(url)
        .send({ text: 'text' })
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
    it('should return 404 if categories not found', async () => {
      return request(server)
        .get(url)
        .set('Authorization', loginResult.token)
        .expect('Content-Type', /json/)
        .expect(404)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.message).to.be.equal('Categories not found');
        });
    });

    it('should return 200 & response two categories in array', async () => {
      await CategoryManager.create('text', loginResult.user.id);
      await CategoryManager.create('text2', loginResult.user.id);
      return request(server)
        .get(url)
        .set('Authorization', loginResult.token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).to.be.a('array');
          expect(response.body.length).to.be.equal(2);
        });
    });
  });

  describe('GET /:id', () => {
    it('should return 200 & response one category', async () => {
      const createdCategory = await CategoryManager.create(
        'text',
        loginResult.user.id,
      );
      await CategoryManager.create('a', loginResult.user.id);
      return request(server)
        .get(url + createdCategory.id)
        .set('Authorization', loginResult.token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('text');
          expect(response.body).to.have.property('color');
          expect(response.body).to.have.property('icon');
          expect(response.body.id).to.be.equal(createdCategory.id);
          expect(response.body.text).to.be.equal(createdCategory.text);
          expect(response.body.color).to.be.equal('');
          expect(response.body.icon).to.be.equal('');
        });
    });
  });

  describe('DELETE /:id', () => {
    it('should return 204', async () => {
      const createdCategory = await CategoryManager.create(
        'text',
        loginResult.user.id,
      );
      return request(server)
        .delete(url + createdCategory.id)
        .set('Authorization', loginResult.token)
        .expect(204);
    });
  });
});

const createUserAndLoginBeforeTest = async (): Promise<void> => {
  registeredUser = await UserManager.register({
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

let registeredUser: UserDocument;
const userLogin = 'userLogin';
const userEmail = 'userEmail';
const userPassword = 'userPassword';
const user = {
  login: userLogin,
  email: userEmail,
  password: userPassword,
} as UserDocument;
const deviceName = 'deviceName';
let loginResult: {
  token: string;
  user: {
    id: string;
    login: string;
    email: string;
  };
};
