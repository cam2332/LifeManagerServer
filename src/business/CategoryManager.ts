import { CategoryDocument } from '../DAO/documents/CategoryDocument';
import { Category } from '../DAO/models/CategoryModel';
import ApplicationError from '../service/ApplicationError';
import * as MongoConverter from '../service/MongoConverter';

export const create = async (
  text: string,
  userId: string,
  color = '',
  icon = '',
): Promise<CategoryDocument> => {
  const categoryData = MongoConverter.toCategory(
    undefined,
    text,
    userId,
    color,
    icon,
  );
  const createdCategory = await Category.createCategory(categoryData);
  return createdCategory;
};

export const getAll = async (userId: string): Promise<CategoryDocument[]> => {
  let categories: CategoryDocument[] = [];
  try {
    categories = await Category.getByUserId(userId);
    if (!categories || categories.length === 0) {
      throw new ApplicationError(
        'Categories not found',
        ApplicationError.NOT_FOUND.code,
      );
    }
  } catch (error) {
    if (error instanceof ApplicationError) {
      throw error;
    } else {
      throw new ApplicationError(
        'Categories not found',
        ApplicationError.NOT_FOUND.code,
      );
    }
  }
  return categories;
};

export const getById = async (id: string): Promise<CategoryDocument> => {
  let category: CategoryDocument | null = null;
  try {
    category = await Category.findById(id);
    if (!category) {
      throw new ApplicationError(
        'Category not found',
        ApplicationError.NOT_FOUND.code,
      );
    }
  } catch (error) {
    if (error instanceof ApplicationError) {
      throw error;
    } else {
      throw new ApplicationError(
        'Category not found',
        ApplicationError.NOT_FOUND.code,
      );
    }
  }
  return category;
};

export const deleteById = async (id: string): Promise<boolean> => {
  try {
    await Category.findByIdAndDelete(id);
  } catch (error) {
    if (error instanceof ApplicationError) {
      throw error;
    } else {
      throw new ApplicationError(
        'Category not found',
        ApplicationError.NOT_FOUND.code,
      );
    }
  }
  return true;
};
