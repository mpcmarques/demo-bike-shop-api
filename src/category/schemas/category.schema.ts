import * as mongoose from 'mongoose';

export const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  products: { type: [mongoose.Schema.Types.ObjectId], ref: 'Product' },
  category: { type: String, required: true },
});
