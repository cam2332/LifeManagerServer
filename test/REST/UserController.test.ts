import { expect } from 'chai';
import { describe } from 'mocha';
import request from 'supertest';
import bodyParser from 'body-parser';
import express, { Application } from 'express';
import routes from '../../src/REST/Routes';
import * as InMemoryMongo from '../InMemoryMongo';
import * as UserManager from '../../src/business/UserManager';
import { UserDocument } from '../../src/DAO/documents/UserDocument';

describe('Note Controller', () => {
  let server: Application;
  const url = '/api/v1/user/';

  before(async () => {
    await InMemoryMongo.connect();
    server = express();
    server.use(bodyParser.json());
    server.use('/api/v1', routes);
  });

  afterEach(async () => await InMemoryMongo.clearDatabase());

  after(async () => await InMemoryMongo.closeDatabase());

  describe('POST /register', () => {
    it('should return 201', async () => {
      return request(server)
        .post(url + 'register')
        .send({
          login: 'login',
          email: 'test@example.com',
          password: 'password',
        })
        .expect(201)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.login).to.be.equal('login');
          expect(response.body.login).to.be.a('string');
          expect(response.body.email).to.be.equal('test@example.com');
          expect(response.body.email).to.be.a('string');
        });
    });

    it('should return 409 if email and login are already in use', async () => {
      await UserManager.register({
        login: 'login',
        email: 'test@example.com',
        password: 'password',
      } as UserDocument);
      return request(server)
        .post(url + 'register')
        .send({
          login: 'login',
          email: 'test@example.com',
          password: 'password',
        })
        .expect(409)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.message).to.be.equal(
            'User with that email and login already exist',
          );
        });
    });

    it('should return 409 if login is already in use', async () => {
      await UserManager.register({
        login: 'login',
        email: 'test@example.com',
        password: 'password',
      } as UserDocument);
      return request(server)
        .post(url + 'register')
        .send({
          login: 'login',
          email: 'test1@example.com',
          password: 'password',
        })
        .expect(409)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.message).to.be.equal(
            'User with that login already exist',
          );
        });
    });

    it('should return 409 if email is already in use', async () => {
      await UserManager.register({
        login: 'login',
        email: 'test@example.com',
        password: 'password',
      } as UserDocument);
      return request(server)
        .post(url + 'register')
        .send({
          login: 'login1',
          email: 'test@example.com',
          password: 'password',
        })
        .expect(409)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.message).to.be.equal(
            'User with that email already exist',
          );
        });
    });
  });

  describe('POST /login', () => {
    it('should return 200', async () => {
      await UserManager.register({
        login: 'login',
        email: 'test@example.com',
        password: 'password',
      } as UserDocument);
      return request(server)
        .post(url + 'login')
        .send({
          login: 'login',
          password: 'password',
          deviceName: 'test',
        })
        .expect(200)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.user.id).to.be.a('string');
          expect(response.body.user.login).to.be.equal('login');
          expect(response.body.user.login).to.be.a('string');
          expect(response.body.user.email).to.be.equal('test@example.com');
          expect(response.body.user.email).to.be.a('string');
          expect(response.body.token).to.be.a('string');
          expect(response.body.token).to.match(
            new RegExp('^[A-Za-z0-9-_=]+.[A-Za-z0-9-_=]+.?[A-Za-z0-9-_.+/=]*$'),
          );
        });
    });

    it('should return 401 if user with login does not exist', async () => {
      await UserManager.register({
        login: 'login',
        email: 'test@example.com',
        password: 'password',
      } as UserDocument);
      return request(server)
        .post(url + 'login')
        .send({
          login: 'login1',
          password: 'password',
          deviceName: 'test',
        })
        .expect(401)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.message).to.be.equal(
            'User with that email or login does not exist',
          );
        });
    });

    it('should return 401 if user with email does not exist', async () => {
      await UserManager.register({
        login: 'login',
        email: 'test@example.com',
        password: 'password',
      } as UserDocument);
      return request(server)
        .post(url + 'login')
        .send({
          email: 'test1@example.com',
          password: 'password',
          deviceName: 'test',
        })
        .expect(401)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.message).to.be.equal(
            'User with that email or login does not exist',
          );
        });
    });

    it('should return 401 if password is invalid', async () => {
      await UserManager.register({
        login: 'login',
        email: 'test@example.com',
        password: 'password',
      } as UserDocument);
      return request(server)
        .post(url + 'login')
        .send({
          login: 'login',
          password: 'password1',
          deviceName: 'test',
        })
        .expect(401)
        .then((response) => {
          expect(response.body).to.be.a('object');
          expect(response.body.message).to.be.equal('Invalid password');
        });
    });

    describe('POST /logout', () => {
      it('should return 200', async () => {
        await UserManager.register({
          login: 'login',
          email: 'test@example.com',
          password: 'password',
        } as UserDocument);
        const loginResult = await UserManager.authenticate(
          'login',
          'password',
          'test',
        );
        return request(server)
          .delete(url + 'logout')
          .set('Authorization', loginResult.token)
          .expect(200)
          .then((response) => {
            expect(response.body).to.be.a('object');
            expect(response.body.message).to.be.equal('Logout successful');
          });
      });

      it('should return 404 if user not logged in', async () => {
        await UserManager.register({
          login: 'login',
          email: 'test@example.com',
          password: 'password',
        } as UserDocument);
        const loginResult = await UserManager.authenticate(
          'login',
          'password',
          'test',
        );
        await UserManager.logout(loginResult.user.id, 'test');
        return request(server)
          .delete(url + 'logout')
          .set('Authorization', loginResult.token)
          .expect(404)
          .then((response) => {
            expect(response.body).to.be.a('object');
            expect(response.body.message).to.be.equal('Logout failed');
          });
      });
    });
  });
});
