import { Model, model } from 'mongoose';
import { CategorySchema } from '../schemas/CategorySchema';
import { CategoryDocument } from '../documents/CategoryDocument';

export interface CategoryModel extends Model<CategoryDocument> {
  createCategory(newCategory: CategoryDocument): Promise<CategoryDocument>;
  getByUserId(userId: string): Promise<CategoryDocument[]>;
}

export const Category: CategoryModel = model<CategoryDocument, CategoryModel>(
  'categories',
  CategorySchema,
);
