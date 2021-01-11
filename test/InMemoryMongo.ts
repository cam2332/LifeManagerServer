import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongodb = new MongoMemoryServer();

export const connect = async (): Promise<void> => {
  const uri = await mongodb.getUri('LifeManager');
  const mongooseOptions = {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  await mongoose.connect(uri, mongooseOptions);
};

export const closeDatabase = async (): Promise<void> => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongodb.stop();
};

export const clearDatabase = async (): Promise<void> => {
  const collections = await mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};
