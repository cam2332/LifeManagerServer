import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import config from '../../src/config';
import { Types } from 'mongoose';
import * as InMemoryMongo from '../InMemoryMongo';
import * as TokenManager from '../../src/business/TokenManager';
import { UserDocument } from '../../src/DAO/documents/UserDocument';

describe('Token Manager', () => {
  before(async () => await InMemoryMongo.connect());

  beforeEach(async () => await createToken());

  afterEach(async () => await InMemoryMongo.clearDatabase());

  after(async () => await InMemoryMongo.closeDatabase());

  it('should create a token', async () => {
    const user = { id: userId } as UserDocument;
    const tokenValue = await TokenManager.create(user, deviceName);
    const payload = jwt.verify(tokenValue, config.JwtSecret);

    expect(tokenValue.length).to.not.be.equal(0);
    expect((payload as any).user.id).to.be.equal(userId);
    expect((payload as any).deviceName).to.be.equal(deviceName);
  });

  it('should remove token', async () => {
    expect(await TokenManager.remove(userId, deviceName)).to.be.equal(true);
  });

  it('should not remove token if invalid deviceName', async () => {
    expect(await TokenManager.remove(userId, '')).to.be.equal(false);
  });

  it('should not remove token if invalid userId', async () => {
    expect(await TokenManager.remove('', deviceName)).to.be.equal(false);
  });

  it('should get user id from token payload', () => {
    const payload = jwt.verify(tokenValue, config.JwtSecret);
    expect(
      TokenManager.getUserIdFromPayload(payload as Record<string, unknown>),
    ).to.be.equal(userId);
  });

  it('should get device name from token payload', () => {
    const payload = jwt.verify(tokenValue, config.JwtSecret);
    expect(
      TokenManager.getDeviceNameFromPayload(payload as Record<string, unknown>),
    ).to.be.equal(deviceName);
  });
});

const createToken = async () => {
  const user = { id: userId } as UserDocument;
  tokenValue = await TokenManager.create(user, deviceName);
};

const userId = Types.ObjectId().toHexString();
const deviceName = 'test';
let tokenValue: string;
