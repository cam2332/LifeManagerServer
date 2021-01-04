import { Schema, Types } from 'mongoose';
import { CategoryDocument } from '../documents/CategoryDocument';
import { Category } from '../models/CategoryModel';

export const CategorySchema: Schema = new Schema(
  {
    _id: { type: Types.ObjectId },
    text: { type: String, required: true },
    color: String,
    icon: String,
    userId: { type: Types.ObjectId, ref: 'users', required: true },
  },
  { versionKey: false, collection: 'categories' },
);

CategorySchema.statics.createCategory = async (
  newCategory: CategoryDocument,
): Promise<CategoryDocument> => {
  const category = new Category(newCategory);
  return category.save();
};
CategorySchema.statics.getByUserId = async (
  userId: string,
): Promise<CategoryDocument[]> => {
  const categories = await Category.find({ userId: Types.ObjectId(userId) });
  return categories;
};
