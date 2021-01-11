import { expect } from 'chai';
import { describe } from 'mocha';
import { Types } from 'mongoose';
import * as InMemoryMongo from '../InMemoryMongo';
import * as CategoryManager from '../../src/business/CategoryManager';
import ApplicationError from '../../src/service/ApplicationError';

describe('Category Manager', () => {
  before(async () => await InMemoryMongo.connect());

  beforeEach(async () => await createCategoryBeforeTest());

  afterEach(async () => await InMemoryMongo.clearDatabase());

  after(async () => await InMemoryMongo.closeDatabase());

  it('should create a category', async () => {
    const createdCategory = await CategoryManager.create(
      categoryText,
      userId,
      categoryColor,
      categoryIcon,
    );

    expect(createdCategory.text).to.be.equal(categoryText);
    expect(createdCategory.color).to.be.equal(categoryColor);
    expect(createdCategory.icon).to.be.equal(categoryIcon);
    expect(createdCategory.userId).to.be.eql(Types.ObjectId(userId));
  });

  it('should create a category with only text and userId', async () => {
    const createdCategory = await CategoryManager.create(categoryText, userId);

    expect(createdCategory.text).to.be.equal(categoryText);
    expect(createdCategory.userId).to.be.eql(Types.ObjectId(userId));
    expect(createdCategory.color).to.be.equal('');
    expect(createdCategory.icon).to.be.equal('');
  });

  it('should get category by id', async () => {
    const foundCategory = await CategoryManager.getById(categoryId);

    expect(foundCategory.text).to.be.equal(categoryText);
    expect(foundCategory.userId).to.be.eql(Types.ObjectId(userId));
    expect(foundCategory.color).to.be.equal(categoryColor);
    expect(foundCategory.icon).to.be.equal(categoryIcon);
  });

  it('should throw error if no category id is provided', async () => {
    try {
      await CategoryManager.getById('');
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Category not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it('should throw error if invalid category id is provided', async () => {
    try {
      await CategoryManager.getById(Types.ObjectId().toHexString());
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Category not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it('should get categories by user id', async () => {
    const foundCategories = await CategoryManager.getAll(userId);

    expect(foundCategories.length).to.be.equal(1);
    expect(foundCategories[0].id).to.be.equal(categoryId);
  });

  it('should throw error if no user id is provided', async () => {
    try {
      await CategoryManager.getAll('');
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Categories not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it('should delete category by id', async () => {
    expect(await CategoryManager.deleteById(categoryId)).to.be.equal(true);
    try {
      await CategoryManager.getAll(userId);
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Categories not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it('should throw error if invalid category id', async () => {
    try {
      await CategoryManager.deleteById(Types.ObjectId().toHexString());
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Category not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });

  it('should throw error if no category id', async () => {
    try {
      await CategoryManager.deleteById('');
    } catch (error) {
      expect(error).to.be.instanceOf(ApplicationError);
      expect(error.message).to.be.equal('Category not found');
      expect(error.code).to.be.equal(ApplicationError.NOT_FOUND.code);
    }
  });
});

const createCategoryBeforeTest = async (): Promise<void> => {
  categoryId = await createCategory();
};

const createCategory = async (): Promise<string> => {
  const createdCategory = await CategoryManager.create(
    categoryText,
    userId,
    categoryColor,
    categoryIcon,
  );
  return createdCategory.id;
};

const userId = Types.ObjectId().toHexString();
let categoryId: string;
const categoryText = 'text';
const categoryColor = '#ffffff';
const categoryIcon = 'icon';
