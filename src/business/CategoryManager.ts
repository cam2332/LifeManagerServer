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
  const categoryData = MongoConverter.toCategory(text, userId, color, icon);
  const createdCategory = await Category.createCategory(categoryData);
  return createdCategory;
};

export const getAll = async (userId: string): Promise<CategoryDocument[]> => {
  const categories = await Category.getByUserId(userId);
  if (!categories) {
    throw new ApplicationError(
      'Categories not found',
      ApplicationError.NOT_FOUND.code,
    );
  }
  return categories;
};

export const getById = async (id: string): Promise<CategoryDocument> => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApplicationError(
      'Category not found',
      ApplicationError.NOT_FOUND.code,
    );
  }
  return category;
};

export const deleteById = async (id: string): Promise<boolean> => {
  const deletedCategory = await Category.findByIdAndDelete(id);
  if (!deletedCategory) {
    throw new ApplicationError(
      'Category not found',
      ApplicationError.NOT_FOUND.code,
    );
  }
  return true;
};
