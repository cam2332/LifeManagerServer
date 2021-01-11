import { expect } from 'chai';
import { describe } from 'mocha';
import * as InMemoryMongo from '../InMemoryMongo';
import * as UserManager from '../../src/business/UserManager';
import ApplicationError from '../../src/service/ApplicationError';
import { UserDocument } from '../../src/DAO/documents/UserDocument';
import * as HashService from '../../src/service/HashService';

describe('User manager', () => {
  before(async () => await InMemoryMongo.connect());

  beforeEach(async () => await createUserAndLoginBeforeTest());

  afterEach(async () => await InMemoryMongo.clearDatabase());

  after(async () => await InMemoryMongo.closeDatabase());

  it('should correctly register user', async () => {
    const createdUser = await UserManager.register({
      login: 'anotherLogin',
      email: 'anotherEmail',
      password: 'anotherPassword',
    } as UserDocument);

    expect(createdUser.login).to.be.equal('anotherLogin');
    expect(createdUser.email).to.be.equal('anotherEmail');
    expect(createdUser.password).to.be.equal(
      HashService.hash('anotherPassword', createdUser.salt),
    );
  });

  it('should throw an error if user with login already exists', async () => {
    try {
      await UserManager.register({
        ...user,
        email: 'anotherEmail',
      } as UserDocument);
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('User with that login already exist');
      expect(error.code).to.be.equal(ApplicationError.CONFLICT.code);
    }
  });

  it('should throw an error if user with email already exists', async () => {
    try {
      await UserManager.register({
        ...user,
        login: 'anotherLogin',
      } as UserDocument);
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('User with that email already exist');
      expect(error.code).to.be.equal(ApplicationError.CONFLICT.code);
    }
  });

  it('should throw an error if user with email and login already exists', async () => {
    try {
      await UserManager.register(user);
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal(
        'User with that email and login already exist',
      );
      expect(error.code).to.be.equal(ApplicationError.CONFLICT.code);
    }
  });

  it('should login user', async () => {
    const loggedUser = await UserManager.authenticate(
      userLogin,
      userPassword,
      'test',
    );

    expect(loggedUser).to.be.a('object');
    expect(loggedUser.token).to.be.a('string');
    expect(loggedUser.token).to.match(
      new RegExp('^[A-Za-z0-9-_=]+.[A-Za-z0-9-_=]+.?[A-Za-z0-9-_.+/=]*$'),
    );
    expect(loggedUser.user).to.be.a('object');
    expect(loggedUser.user.id).to.be.equal(registeredUser.id);
    expect(loggedUser.user.login).to.be.equal(userLogin);
    expect(loggedUser.user.email).to.be.equal(userEmail);
  });

  it('should throw an error if user with login or email does not exist', async () => {
    try {
      await UserManager.authenticate('', '', '');
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal(
        'User with that email or login does not exist',
      );
      expect(error.code).to.be.equal(ApplicationError.UNAUTHORIZED.code);
    }
  });

  it('should logout user', async () => {
    expect(
      await UserManager.logout(loginResult.user.id, deviceName),
    ).to.be.equal(true);
  });

  it('should throw an error if invalid user id is provided', async () => {
    try {
      await UserManager.logout('', '');
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Logout failed');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
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
